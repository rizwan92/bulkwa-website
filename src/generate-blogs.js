const path = require("path");
const fs = require("fs");

const keyWordTextFile = path.join(
  __dirname,
  "./keywords/restaurant-keyword.txt"
);
const cityFile = path.join(__dirname, "./data/cities.json");
const { simpleSitemapAndIndex } = require("sitemap");
const { siteName, AUTHORS, URL, ogImage } = require("./constants/restaurant");

const sourceData = [];

const main = async () => {
  sourceData.push({
    url: URL + "/",
    changefreq: "daily",
    priority: 1,
    lastmod: new Date().toISOString(),
  });
  sourceData.push({
    url: `${URL}/blogs/`,
    changefreq: "daily",
    priority: 1,
    lastmod: new Date().toISOString(),
  });
  const keywords = fs.readFileSync(keyWordTextFile, "utf8").split("\n");
  const cities = JSON.parse(fs.readFileSync(cityFile, "utf8"));
  const blogs = [];

  keywords.forEach((keyword) => {
    const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
    const blogPath = keyword?.replace(/\s/g, "-");
    const publishDate = new Date().toISOString();
    const URI = `${URL}/blogs/${blogPath}.html`;
    blogs.push({
      title: `${keyword}`,
      description: `The restaurant software billing demo is user-friendly and easy to use. You can also customize the software to your own needs. The demo is recommended for businesses that want to improve their billing and control their costs.`,
      url: "/blogs/" + blogPath + ".html",
      keyword: `${keyword}, restaurant accounting software, restaurant billing software, restaurant inventory software, cloud-based restaurant inventory and billing management system, easy to use restaurant inventory and billing management system, helps restaurant owners manage their inventory and billing`,
      author: author,
      publishDate: publishDate,
      URL: URI,
      ogImage: ogImage,
    });
    sourceData.push({
      url: URI,
      changefreq: "daily",
      priority: 1,
      lastmod: publishDate,
    });
  });

  // cities.forEach((city) => {
  //   keywords.forEach((keyword) => {
  //     const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
  //     const blogPath =
  //       keyword?.replace(/\s/g, "-") +
  //       "-" +
  //       city.city?.replace(/\s/g, "-") +
  //       "-" +
  //       city.admin_name?.replace(/\s/g, "-");
  //     const publishDate = new Date().toISOString();
  //     const URI = `${URL}/blogs/${blogPath}.html`;
  //     blogs.push({
  //       title: `${keyword} in ${city.city} ${city.admin_name}`,
  //       description: `The restaurant software billing demo in ${city.city}, ${city.admin_name}  is user-friendly and easy to use. You can also customize the software to your own needs. The demo is recommended for businesses that want to improve their billing and control their costs.`,
  //       url: "/blogs/" + blogPath + ".html",
  //       keyword: `${keyword} in ${city.city} ${city.admin_name}, restaurant accounting software, restaurant billing software, restaurant inventory software, cloud-based restaurant inventory and billing management system, easy to use restaurant inventory and billing management system, helps restaurant owners manage their inventory and billing`,
  //       ...city,
  //       author: author,
  //       publishDate: publishDate,
  //       URL: URI,
  //       ogImage: ogImage,
  //     });

  //     sourceData.push({
  //       url: URI,
  //       changefreq: "daily",
  //       priority: 1,
  //       lastmod: publishDate,
  //     });
  //   });
  // });

  fs.writeFileSync(
    path.join(__dirname, "./data/blogs.json"),
    JSON.stringify(blogs, null, 2)
  );
  console.log("blogs.json saved");
  simpleSitemapAndIndex({
    hostname: URL + "/sitemap/",
    destinationDir: "./public/sitemap/",
    sourceData: sourceData,
    limit: 1000,
    gzip: false,
    xmlns: {
      // trim the xml namespace
      // news: true, // flip to false to omit the xml namespace for news
      xhtml: true,
    },
  }).then(() => {
    console.log("sitemap-generation done");
    // Do follow up actions
  });
};

main();
