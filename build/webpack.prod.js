const webpack = require('webpack')
const merge = require('webpack-merge')
const ZipPlugin = require('zip-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const baseWebpack = require('./webpack.base')

module.exports = merge(baseWebpack, {
  mode: 'production',
  devtool: '#cheap-module-source-map',
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ZipPlugin({
      path: '.',
      filename: 'extension.zip'
    })
  ]
})