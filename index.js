const fs = require("fs");
const path = require("path");

function getData() {
  new Promise((resolve) => {
    fs.readFile(path.join(__dirname, "result.json"), "utf-8", (err, data) => {
      console.log(JSON.parse(data));
    });
  });
}

getData();
