const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    // 'role/role': './assets/scripts/role/roleVM.ts',
    main: "./src/main.tsx",
    // vendor: ["bootstrap"]
  },
  // devtool: 'inline-source-map',
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        loaders: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "resolve-url-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sourceMapContents: false,
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/"),
  },
  devServer: {
    headers: {
      "X-Custom-Foo": "bar",
    },
    contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "assets")],
    // lazy: true,
    // compress: true,
    filename: "bundle.js",
    port: 3030,
  },
  plugins: [
    new MiniCssExtractPlugin({
      options: {
        modules: true,
        sourceMap: true,
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
      },
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};
