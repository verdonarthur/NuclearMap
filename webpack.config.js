const path = require('path');
const webpack = require('webpack');

let PORT = process.env.PORT || 8080;
let URL_LOCAL_SERVER = JSON.stringify('http://localhost:'+ PORT)
console.log(PORT)
console.log(process.env.PORT)

module.exports = {
  mode: 'production',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.DefinePlugin({
      'URL_LOCAL_SERVER': URL_LOCAL_SERVER
  })
  ]
};