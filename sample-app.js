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
    output = output.split(
      '<h2 class="latest-stories__heading">Latest Stories</h2>'
    )[1];

    const srcSplitUp = output.match(/<ul>([\s\S]*?)ul>/g);
    const source = srcSplitUp[0].match(/<li([\s\S]*?)li>/g);
    source.forEach((src) => {
      const obj = {};
      const aFind = src.match(/<a href([\s\S]*?)>/g);
      obj.link = aFind[0].replace(/(<a href="|>)/g, "");
      obj.link = obj.link.replace('\"', '');
      if (obj.link.startsWith("/")) {
        obj.link = "https://time.com" + obj.link;
      }
      var tit = src.match(
        /<h3 class="latest-stories__item-headline">([\s\S]*?)h3>/g
      );
      console.log(tit);
      tit = tit[0].replace('<h3 class="latest-stories__item-headline">', "");
      tit = tit.replace("</h3>", "");
      tit = tit.replace("<em>", "");
      tit = tit.replace("</em>", "");
      obj.title = tit;
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
