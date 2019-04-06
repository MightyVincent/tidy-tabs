const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const baseWebpack = require('./webpack.base')

module.exports = merge(baseWebpack, {
  mode: 'development',
  devtool: '#cheap-module-source-map',
  watch: true,
  plugins: [
    new FriendlyErrorsPlugin()
  ]
})