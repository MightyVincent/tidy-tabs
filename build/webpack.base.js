const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ChromeReloadPlugin = require('wcer')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateLocaleJsonPlugin = require('./plugins/GenerateLocaleJsonPlugin')
const {
  htmlPage
} = require('./utils')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootDir = path.resolve(__dirname, '..')
const devMode = process.env.NODE_ENV !== 'production'

let resolveSrc = (dir) => path.join(rootDir, 'src', dir)

module.exports = {
  entry: {
    popup: resolveSrc('./popup'),
    tab: resolveSrc('./tab'),
    options: resolveSrc('./options'),
    content: resolveSrc('./content'),
    devtools: resolveSrc('./devtools'),
    panel: resolveSrc('./devtools/panel'),
    background: resolveSrc('./background'),
  },
  output: {
    path: path.join(rootDir, 'dist'),
    publicPath: '/',
    filename: 'js/[name].js',
    // chunkFilename: 'js/[id].[name].js?[hash]',
    chunkFilename: 'js/[name].js?[hash]',
    library: '[name]',
  },
  resolve: {
    extensions: [".ts", ".tsx", '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolveSrc('./'),
      '@@': rootDir,
    },
  },
  module: {
    rules: [{
      test: /\.(tsx?|js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      options: {
        formatter: require('eslint-friendly-formatter')
      },
      include: [path.join(rootDir, 'src')],
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        extractCSS: true,
        transformToRequire: {
          video: 'src',
          source: 'src',
          img: 'src',
          image: 'xlink:href',
        },
      },
    }, {
      test: /\.pug$/,
      loader: 'pug-plain-loader'
    }, {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: { appendTsSuffixTo: [/\.vue$/] },
      exclude: /node_modules/
    }, {
      test: /\.(css|sass|scss)$/,
      use: [
        devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
        'postcss-loader',
      ]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        name: 'img/[name].[hash:7].[ext]',
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        name: 'media/[name].[hash:7].[ext]',
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[hash:7].[ext]',
      },
    }],
  },
  plugins: [
    new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
    // Customize your extension structure.
    htmlPage('home', 'app', ['vendor', 'tab']),
    htmlPage('popup', 'popup', ['vendor', 'popup']),
    htmlPage('panel', 'panel', ['vendor', 'panel']),
    htmlPage('devtools', 'devtools', ['vendor', 'devtools']),
    htmlPage('options', 'options', ['vendor', 'options']),
    htmlPage('background', 'background', ['vendor', 'background']),
    // End customize
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new ChromeReloadPlugin({
      port: 9090,
      manifest: path.join(rootDir, 'src', 'manifest.ts')
    }),
    new GenerateLocaleJsonPlugin({
      _locales: path.join(rootDir, 'src', '_locales'),
    }),
    new CopyWebpackPlugin([{
      // from: path.join(rootDir, 'static')
      from: 'static',
    }]),
    new webpack.ProvidePlugin({
      _: 'lodash'
    })
  ],
  optimization: {
    chunkIds: 'natural',
    splitChunks: {
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/].+\.js$/,
          // test(module, chunks) {
          //   if (/[\\/]node_modules[\\/]/.test(module.resource)) {
          //     console.log(module.resource)
          //   }
          //   return (
          //     module.resource &&
          //     /\.js$/.test(module.resource) &&
          //     module.resource.startsWith(path.join(__dirname, '../node_modules'))
          //   )
          // },
          priority: -10,
          chunks: "all"
        },
        // default: {
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true
        // }
      }
    }
  },
}
