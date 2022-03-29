const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const StreamArray = require("stream-json/streamers/StreamArray");
const axios = require("axios");

const auth = new google.auth.GoogleAuth({
  keyFile: "chikupos-service-account.json",
  // keyFile: "publicdrop-service-account.json",
  scopes: ["https://www.googleapis.com/auth/indexing"],
});

const indexing = async (URL, _index) => {
  try {
    const indexing = google.indexing({ version: "v3", auth });
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: URL,
        type: "URL_UPDATED",
      },
    });
    console.log(_index, res?.data?.urlNotificationMetadata?.url);
  } catch (error) {
    console.log(_index, error.message);
  }
};

const main = async () => {
  const BlogDataPath = path.join(__dirname, "./data/blogs.json");
  // read /data/blogs.json file and get all blogs
  const jsonStream = StreamArray.withParser();
  fs.createReadStream(BlogDataPath).pipe(jsonStream.input);
  jsonStream.on("data", async ({ key = 0, value: blog }) => {
    jsonStream.pause();
    if (key > 0 && key <= 10) {
      await indexing(blog.URL, key);
    }
    jsonStream.resume();
  });
  jsonStream.on("end", () => {
    console.log("All Done");
  });

  // const LinkFile = path.join(__dirname, "./links.txt");
  // const links = fs.readFileSync(LinkFile, "utf8").split("\n");
  // // console.log(links[0]);
  // // await indexing(links[0], 0);
  // for (let i = 0; i < links.length; i++) {
  //   const link = links[i];
  //   if (link.length > 0) {
  //     await indexing(link, i);
  //   }
  // }
};
main().catch(console.error);
