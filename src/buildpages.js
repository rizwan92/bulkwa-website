const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");
const AmpOptimizer = require("@ampproject/toolbox-optimizer");
const { generateBlogJSONLD } = require("./jsonld");
const StreamArray = require("stream-json/streamers/StreamArray");
const { URL, siteName } = require("./constants/restaurant");
const { generateMetaTagsForBlogPage, generateAnalytics } = require("./metatag");

const ampOptimizer = AmpOptimizer.create({
  extensionVersions: {
    "amp-twitter": "0.1",
  },
  extensions: ["amp-twitter"],
});

nunjucks.configure({
  autoescape: true,
  noCache: true,
});

const blogPath = path.join(__dirname, "./templates/blog.html");
const blogOutputPath = path.join(__dirname, "../public/blogs/index.html");
const BlogDataPath = path.join(__dirname, "./data/blogs.json");
const blogPostPath = path.join(__dirname, "./templates/blog-post.html");

const firstTenBlogs = [];

const main = async () => {
  const jsonStream = StreamArray.withParser();
  fs.createReadStream(BlogDataPath).pipe(jsonStream.input);
  jsonStream.on("data", async ({ key = 0, value: blog }) => {
    try {
      // if (key > 0 && key < 20) {
      if (key < 10) {
        firstTenBlogs.push(blog);
      }
      if (key === 10) {
        generateBlogHomePage(firstTenBlogs);
      }
      jsonStream.pause();
      const blogPageURL = `${URL}${blog.url}`;
      const blogPostRenderer = nunjucks.render(blogPostPath, {
        blog,
        publishDate: new Date(blog.publishDate).toDateString(),
        blogJSONLD: JSON.stringify(generateBlogJSONLD(blog), null, 2),
        URL: `${URL}${blog.url}`,
        meta: generateMetaTagsForBlogPage(blog),
        analytics: JSON.stringify(
          generateAnalytics(blog.title, blogPageURL),
          null,
          2
        ),
      });
      const blogPostOutputPath = path.join(__dirname, `../public/${blog.url}`);
      const optimizedBlogPostHtml = await ampOptimizer.transformHtml(
        blogPostRenderer
      );
      fs.writeFileSync(blogPostOutputPath, blogPostRenderer);
      // show console on set of 1000 blogs
      if (key % 1000 === 0) {
        console.log(key);
        console.log(key, blogPostOutputPath);
      }
      jsonStream.resume();
      // }
    } catch (error) {
      console.log(error);
    }
  });

  jsonStream.on("end", () => {
    console.log("All Done");
  });
};

const generateBlogHomePage = async (tempBlogs) => {
  try {
    const blogPage = URL + "/blogs/";
    const blogRenderer = nunjucks.render(blogPath, {
      blogs: tempBlogs,
      URL: blogPage,
      analytics: JSON.stringify(generateAnalytics(siteName, blogPage), null, 2),
    });
    const optimizedHtml = await ampOptimizer.transformHtml(blogRenderer);
    fs.writeFileSync(blogOutputPath, blogRenderer);
    console.log(blogOutputPath);
  } catch (error) {
    console.log(error);
  }
};

main();
