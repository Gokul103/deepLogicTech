const https = require("https");
const http = require("http");

let jsonArray = [];

const options = {
  host: "time.com",
  port: 443,
  path: "/",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

let output = "";

const req = https.request(options, (res) => {
  res.setEncoding("utf8");
  res.on("data", (chunk) => {
    output += chunk;
  });

  res.on("end", () => {
    jsonArray = parseData();
  });
});

req.on("error", (err) => {
  console.error(err);
});
req.end();
const port = "5000";

http
  .createServer((req, res) => {
    if (req.url === "/getTimeStories") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(jsonArray));
    } else res.end("Please pass correct URL");
  })
  .listen(port, () => {
    console.log("Server is listing in port " + port);
  });

/**
 * Function to convert HTML to JSON
 * @returns JSON data from the latest stories section
 */
function parseData() {
  var index = findIndex("latest-stories__heading"),
    result = [];
  for (var i = 0; i < 5; i++) {
    var json = { title: "", link: "https://time.com" },
      toFind = '<a href="';
    (start = findIndex(toFind, index)), (end = findIndex('">', start));
    json.link += getInbetweenText(start + toFind.length, end);

    toFind = '<h3 class="latest-stories__item-headline">';
    start = findIndex(toFind, end);
    end = findIndex("</h3>", start);
    json.title = getInbetweenText(start + toFind.length, end);

    index = end;
    result[i] = json;
  }
  return result;
}

/**
 * Function to find the string index
 * @param {String} toFind String to be found
 * @param {Integer} afterIndex Find the string after this index
 * @returns Index of the string from the data
 */
function findIndex(toFind, afterIndex) {
  var iteration = 0,
    index = 0;
  if (afterIndex) iteration = afterIndex;

  while (iteration !== output.length) {
    var splitString = "";
    for (var i = iteration; i < iteration + toFind.length; i++) {
      splitString += output[i];
    }

    if (splitString === toFind) {
      if (afterIndex && afterIndex > iteration) {
        iteration++;
        continue;
      }
      index = iteration;
      break;
    }
    iteration++;
  }
  return index;
}

/**
 * Function to find the string in between the given indexes
 * @param {Integer} start Starting index
 * @param {Integer} end Ending index
 * @returns
 */
function getInbetweenText(start, end) {
  var returnString = "";
  for (var j = start; j < end; j++) {
    returnString += output[j];
  }
  return returnString;
}
