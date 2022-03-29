const nunjucks = require("nunjucks");
const AmpOptimizer = require("@ampproject/toolbox-optimizer");
const path = require("path");
const fs = require("fs");
const tempBlogs = require("./tempBlogs");
const { generateBlogJSONLD } = require("./jsonld");
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
const blogPostPath = path.join(__dirname, "./templates/blog-post.html");

const main = async () => {
  const blogPage = URL + "/blogs/";
  const blogRenderer = nunjucks.render(blogPath, {
    blogs: tempBlogs,
    URL: blogPage,
    analytics: JSON.stringify(generateAnalytics(siteName, blogPage), null, 2),
  });

  // const optimizedHtml = await ampOptimizer.transformHtml(blogRenderer);
  fs.writeFileSync(blogOutputPath, blogRenderer);
  tempBlogs.forEach(async (blog) => {
    // convert iso to readble publish date
    const blogPageURL = `${URL}${blog.url}`;
    const blogPostRenderer = nunjucks.render(blogPostPath, {
      blog,
      publishDate: new Date(blog.publishDate).toDateString(),
      blogJSONLD: JSON.stringify(generateBlogJSONLD(blog), null, 2),
      URL: blogPageURL,
      meta: generateMetaTagsForBlogPage(blog),
      analytics: JSON.stringify(
        generateAnalytics(blog.title, blogPageURL),
        null,
        2
      ),
    });
    const blogPostOutputPath = path.join(__dirname, `../public/${blog.url}`);
    console.log(blogPostOutputPath);
    // const optimizedBlogPostHtml = await ampOptimizer.transformHtml(
    //   blogPostRenderer
    // );
    fs.writeFileSync(blogPostOutputPath, blogPostRenderer);
  });
};

main();
