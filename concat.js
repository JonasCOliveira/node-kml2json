const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "./json/");

let content = { alvos: [] };
let actions;

var getData = (fileName) =>
  new Promise((resolve) => {
    fs.readFile(path.join(dir, fileName), "utf-8", (err, data) => {
      resolve(data);
    });
  });

function concat() {
  var files = new Promise((resolve) =>
    fs.readdir(dir, function (err, jsonFiles) {
      resolve(jsonFiles);
    })
  );
  files.then((f) => {
    actions = f.map(getData);

    Promise.all(actions).then((response) => {
      content.alvos.push(response.join(","));

      fs.writeFile(
        path.join(__dirname, "result.json"),
        JSON.stringify(content),
        function (err) {
          if (err) {
            throw err;
          }
          console.log("File is created successfully.");
        }
      );
    });
  });
}

function writeFile() {
  fs.writeFile(
    path.join(__dirname, "result.json"),
    JSON.stringify(content),
    function (err) {
      if (err) {
        throw err;
      }
      console.log("File is created successfully.");
    }
  );
}
