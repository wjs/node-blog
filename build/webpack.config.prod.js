const webpack = require('webpack')
const webpackBaseConfig = require('./webpack.config.base')

const config = Object.assign({}, webpackBaseConfig, {
  watch: false,
  devtool: false,
})

config.plugins = config.plugins.concat([
  // short-circuits all Vue.js warning code
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_debugger: true,
      drop_console: true
    },
    output: {
      comments: false
    },
    sourceMap: false
  })
])

module.exports = config
