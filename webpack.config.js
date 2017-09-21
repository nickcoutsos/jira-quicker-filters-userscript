const fs = require('fs')
const path = require('path');
const webpack = require('webpack')

const metadata = fs.readFileSync('./metadata.js').toString()

module.exports = {
  entry: path.resolve('./src/main.js'),
  output: {
    path: path.resolve('./build'),
    filename: 'jira-quicker-filters.user.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.BannerPlugin({
      banner: metadata,
      entryOnly: true,
      raw: true
    })
  ]
}
