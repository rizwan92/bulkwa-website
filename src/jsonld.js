const { siteName, URL } = require("./constants/restaurant");

const generateBlogJSONLD = (blog) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${URL}${blog.url}`,
    },
    headline: blog.title,
    description: blog.description,
    image: `${URL}/assets/images/Banner.png`,
    author: {
      "@type": "Person",
      name: blog.author.name,
      url: `${URL}/blogs/author/${blog.author.username}`,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${URL}/assets/logo/logo.png`,
      },
    },
    datePublished: blog.publishDate.split("T")[0],
    dateModified: blog.publishDate.split("T")[0],
  };
};

module.exports = {
  generateBlogJSONLD,
};
