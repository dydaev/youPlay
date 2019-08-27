const path = require('path');

module.exports = {
  entry: './src/main.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  devServer: {
    headers: {
      'X-Custom-Foo': 'bar'
    },
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'assets')],
    // lazy: true,
    // compress: true,
    filename: 'bundle.js',
    port: 3000
  }
};