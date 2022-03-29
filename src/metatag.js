const generateMetaTagsForBlogPage = (blog) => {
  return `
    <!-- Primary Meta Tags -->
<title>${blog.title}</title>


<meta name="title" content="${blog.title}">
<meta name="description" content="${blog.description}">
<meta name="keywords" content="${blog.keyword}">
<meta name="robots" content="index, follow">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="language" content="English">
<meta name="author" content="${blog.author.name}">
<link rel="canonical" href="${blog.URL}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${blog.URL}">
<meta property="og:title" content="${blog.title}">
<meta property="og:description" content="${blog.description}">
<meta property="og:image" content="${blog.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${blog.ogImage}">
<meta property="twitter:title" content="${blog.title}">
<meta property="twitter:description" content="${blog.description}">
<meta property="twitter:image" content="${blog.ogImage}">
    `;
};

const generateAnalytics = (title, pagePath) => {
  return {
    vars: {
      account: "UA-220729700-1",
    },
    triggers: {
      "default pageview": {
        on: "visible",
        request: "pageview",
        vars: {
          title: title,
          location: pagePath,
        },
      },
    },
  };
};

module.exports = {
  generateMetaTagsForBlogPage,
  generateAnalytics,
};
