const https = require("https");
const http = require("http");

let finalData = "";

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
    let urls = [];
    output = output.split('<div class="trending"')[1];
    const srcSplitUp = output.match(/<figure>([\s\S]*?)figure>/g);
    srcSplitUp.forEach((src) => {
      const obj = {};
      const aFind = src.match(/<a href([\s\S]*?)>/g);
      obj.link = aFind[0].replace(/(<a href=|>)/g, "");
      if (obj.link.startsWith("/")) {
        obj.link = "https://time.com" + obj.link;
      }
      const imgSplit = src.match(/<img[^>]*>/g);
      const alt = imgSplit[0].match(/alt=[^>]*"/g);
      obj.title = alt[0].replace(/(alt=|")/g, "");
      urls.push(obj);
    });
    finalData = urls
      .filter((each) => {
        return each.title;
      })
      .splice(0, 5);
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
      res.end(JSON.stringify(finalData));
    } else res.end("Please pass correct URL");
  })
  .listen(port, () => {
    console.log("Server is listing in port " + port);
  });
