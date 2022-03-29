const { series, src, dest } = require("gulp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
// const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
// var webpHTML = require("gulp-webp-html");
const through2 = require("through2");
const gtm = require("gulp-google-tag-manager");
const sitemap = require("gulp-sitemap");
const gulpSeo = require("gulp-seo");

const AmpOptimizer = require("@ampproject/toolbox-optimizer");

const ampOptimizer = AmpOptimizer.create({
  autoAddMandatoryTags: true,
  autoExtensionImport: true,
  verbose: true,
  imageOptimizer: (src, width) => {
    const index = src.lastIndexOf(".");
    if (index === -1) {
      return null;
    }
    const prefix = src.substring(0, index);
    const postfix = src.substring(index, src.length);
    return `${prefix}.${width}w${postfix}`;
  },
});

// gulp seo
gulp.task("seo", function () {
  return gulp
    .src("views/index.html")
    .pipe(
      gulpSeo({
        list: ["og", "se", "schema", "twitter"],
        meta: {
          title: "Chikupos",
          description: "Restaurant Management Saas Cloud Platform",
          keywords: [
            "Restaurant",
            "Cloud Platform",
            "Restaurant Management",
            "Billing",
          ],
          robots: {
            index: false, // true
            follow: true, // true
          },
          revisitAfter: "1 month", // 3 month
          image: "",
          site_name: "Chikupos ",
          type: "Billing Software",
        },
      })
    )
    .pipe(gulp.dest("./views"));
});

// google anylitics
function gtm(cb) {
  src("./index.html")
    .pipe(
      gtm({
        gtmId: "G-WNS7D29SBH",
      })
    )
    .pipe(dest("build/"));
  cb();
}

// sitemap
function sitemap(cb) {
  src("./build/*.html")
    .pipe(
      sitemap({
        siteUrl: "https://chikupos.com",
      })
    )
    .pipe(dest("./build/"));
  cb();
}

// schema markup
// optimizing the html
function html(cb) {
  src("./index.html")
    .pipe(
      through2.obj(async (file, _, cb) => {
        if (file.isBuffer()) {
          const optimizedHtml = await ampOptimizer.transformHtml(
            file.contents.toString()
          );
          file.contents = Buffer.from(optimizedHtml);
        }
        cb(null, file);
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("build/"));
  cb();
}

// optimizing the css
function css(cb) {
  src("./assets/css/style.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest("build/assets/css/"));
  cb();
}

// optimizing the js
function js(cb) {
  src("./assets/js/index.js").pipe(uglify()).pipe(dest("build/assets/js"));
  cb();
}

// otimizing the images
function images(cb) {
  src("./assets/images/*")
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [
          {
            removeViewBox: true,
          },
        ],
      })
    )
    .pipe(dest("build/assets/images"));
  cb();
}

exports.default = series(html, css, js, images);
