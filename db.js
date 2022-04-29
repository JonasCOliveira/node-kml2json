// Load the AWS SDK for Node.js
import aws from "aws-sdk";
const { config, DynamoDB } = aws;
import { readFile } from "fs";

// Set the region
const REGION = "us-east-2";
config.update({ region: REGION });

// Create the DynamoDB service object
var ddb = new DynamoDB();

const getParams = () =>
  new Promise((resolve, reject) =>
    readFile("./result.json", "utf8", (err, jsonString) => {
    //   const data = JSON.parse(jsonString);
    const data = jsonString;
    resolve(data);
    })
  );

function putItens() {
  getParams().then((response) => {
    var params = {
      TableName: "sigma",
      Item: {
        data: { S: `${response}` },
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
  });
}

putItens();
