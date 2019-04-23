const { lstatSync, readdirSync, readFileSync } = require('fs')
const { join, parse } = require('path')
const Module = require('module')

const isDirectory = (source) => lstatSync(source).isDirectory()
const getDirectories = (source) =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

module.exports = class GenerateLocaleJsonPlugin {

  constructor ({ _locales }) {
    this.__localesPath = _locales
    this._locales = []
    this.pluginName = 'GenerateLocaleJsonPlugin'
  }

  compile (compilationParams) {
    const dirsPath = getDirectories(this.__localesPath)
    dirsPath.forEach((dirPath) => {
      try {
        const localeName = parse(dirPath).base
        const filename = join(this.__localesPath, localeName, 'messages.js')
        const code = readFileSync(filename, 'utf8')
        const mod = new Module(filename)
        mod.filename = filename
        mod._compile(code, filename)
        mod.paths = Module._nodeModulePaths(filename)
        this._locales.push({
          localeName,
          content: mod.exports,
          src: join(dirPath, 'messages.js')
        })
      } catch (err) {
        console.error(err)
      }
    })
  }

  generate (compilation, done) {
    if (!this._locales.length) return done()

    for (let locale of this._locales) {
      compilation.fileDependencies.add(locale.src)
      const source = JSON.stringify(locale.content)
      compilation.assets[join('_locales', locale.localeName, 'messages.json')] = {
        source: () => source,
        size: () => source.length
      }
    }

    return done()
  }

  apply (compiler) {
    compiler.hooks.compile.tap(this.pluginName, (compilationParams) => this.compile(compilationParams))
    // compiler.plugin('compile', (comp) => this.compile(comp))
    compiler.hooks.emit.tapAsync(this.pluginName, (compilation, done) => this.generate(compilation, done))
    // compiler.plugin('emit', (compilation, done) => this.generate(compilation, done))
  }
}
