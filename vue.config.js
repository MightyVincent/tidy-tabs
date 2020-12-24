const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CrxAutoReloadPlugin = require('crx-auto-reload-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const YAML = require('js-yaml')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: '',
  filenameHashing: false,
  productionSourceMap: false,
  /**
   * https://cli.vuejs.org/zh/config/#pages
   */
  pages: (() => {
    const pages = {}
    let dirty = false
    const pagesPath = path.resolve('src/pages')
    fs.readdirSync(pagesPath).forEach((fileName, _) => {
      const entryDir = path.join(pagesPath, fileName)
      if (fs.statSync(entryDir).isDirectory()) {
        const entryPath = path.join(entryDir, 'main.ts')
        if (fs.statSync(entryPath).isFile()) {
          pages[fileName] = {
            entry: entryPath,
            template: `public/${fileName}.html`,
            filename: `${fileName}.html`,
          }
          dirty = true
        }
      }
    })

    return dirty ? pages : undefined
  })(),
  configureWebpack: config => {
    const scriptsPath = path.resolve('src/scripts')
    fs.readdirSync(scriptsPath).forEach((fileName, _) => {
      const entryPath = path.join(scriptsPath, fileName, 'index.ts')
      if (fs.statSync(entryPath).isFile()) {
        config.entry[fileName] = entryPath
      }
    })

    // generic
    config.plugins.push(
      new webpack.ProvidePlugin({
        _: 'lodash'
      }),
      new CopyWebpackPlugin([
        {
          context: 'src',
          from: 'manifest.yml',
          to: 'manifest.json',
          transform: (content, path) => JSON.stringify(YAML.load(content)),
        },
        {
          context: 'src',
          from: '_locales/*.yml',
          to: '[path][name]/messages.json',
          transform: (content, path) => JSON.stringify(YAML.load(content)),
        },
      ]),
    )
    if (isProd) {
      // prod
      config.plugins.push(
        new ZipPlugin({
          path: '.',
          filename: 'dist.zip',
        }),
      )
    } else {
      // dev
      config.plugins.push(
        new CrxAutoReloadPlugin(),
      )
    }
  },
}
