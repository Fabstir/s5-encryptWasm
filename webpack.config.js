const path = require("path");
const { merge } = require("webpack-merge");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          ignore: ["src/**/*.test.ts"],
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
      fs: false
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  output: {
    path: path.resolve(__dirname, "./dist/bundle"),
    // The filename needs to match the index.web.d.ts declarations file.
    filename: "encrypt_file.js",
    library: {
      name: 'encrypt_file',
      type: 'umd',
    },
    globalObject: 'this',
  },
};
