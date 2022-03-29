// Load modules
const webpack = require("webpack");
const path = require("path");

// Create an empty config
const webpackConfig = {
  entry: [
    "webpack-hot-middleware/client",
    path.join(__dirname, "src/index.js"),
  ],
  //   output: {
  //     path: __dirname,
  //     publicPath: "/public",
  //     filename: "bundle.js",
  //   },
  hotReloadServer: {
    address: "localhost",
    port: 4000,
  },
  devtool: "#source-map",
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
  ],
};

module.exports = webpackConfig;
