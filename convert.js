const converter = require("@tmcw/togeojson");
const DOMParser = require("xmldom").DOMParser;
const fs = require("fs");
const jsonConcat = require("json-concat");
const { basename } = require("path");
const path = require("path");

const aws = require("aws-sdk");
const { config, DynamoDB } = aws;

// Set the region
const REGION = "us-east-2";
config.update({ region: REGION });

// Create the DynamoDB service object
var ddb = new DynamoDB();

const dir = path.join(__dirname, "./data/");
const jsonDir = path.join(__dirname, "./json");

fs.readdir(dir, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  files.forEach(function (file, index) {
    const parsedKML = new DOMParser().parseFromString(
      fs.readFileSync(path.join(dir, file), "utf8")
    );

    const extension = path.extname(file);
    const filename = basename(file, extension);
    const geojson = converter.kml(parsedKML);

    fs.writeFile(
      path.join(jsonDir, `${filename}.json`),
      JSON.stringify(geojson),
      function (err) {
        if (err) {
          throw err;
        }
        console.log("File is created successfully.");
      }
    );
  });
});

function putItens(data) {
  let info = JSON.parse(data).features[0];

  var params = {
    TableName: "sigma",
    Item: {
      ID: { S: `${info.id}` },
      coordenadas: { S: `[${info.geometry.coordinates}]` },
      nome: { S: `${info.properties.nome}` },
      empresa: { S: `${info.properties.empresa}` },
      buffer: { S: `${info.properties.buffer}` },
    },
  };

  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}
