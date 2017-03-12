const webpackBaseConfig = require('./webpack.config.base')

module.exports = Object.assign({}, webpackBaseConfig, {
  watch: true,
  devtool: 'source-map'
})
