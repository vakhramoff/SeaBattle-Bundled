const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src",
  output: {
    filename: "[name].[hash].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  // devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/favicon.ico",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: false,
    port: 4200,
  },
};
