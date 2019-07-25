const path = require("path");

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: "./frontend/twitter.js",
  output: {
    path: path.join(__dirname, "app", "assets", "javascripts"),
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: "[resourcePath]",
    devtoolFallbackModuleFilenameTemplate: "[resourcePath]?[hash]"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["@babel/env"]
          }
        }
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", "*"]
  }
};
