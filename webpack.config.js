const fs = require('fs')
const path = require('path');
const { BannerPlugin } = require('webpack')

const metadata = fs.readFileSync('./metadata.txt').toString()

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
    new BannerPlugin({
      banner: metadata,
      entryOnly: true,
      raw: true
    })
  ]
}
