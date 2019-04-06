const {
  resolve,
} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.htmlPage = (title, filename, chunks, template) => new HtmlWebpackPlugin({
  title,
  hash: true,
  cache: true,
  inject: 'body',
  filename: './pages/' + filename + '.html',
  template: template || resolve(__dirname, './page.ejs'),
  appMountId: 'app',
  chunks,
})