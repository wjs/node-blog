const webpack = require('webpack')
const webpackConfigDev = require('./webpack.config.dev')
const webpackConfigProd = require('./webpack.config.prod')
const argv = require('yargs').argv

webpack(argv.dev ? webpackConfigDev : webpackConfigProd, (err, stats) => {
  if (err) {
    throw err
  }
  process.stdout.write(stats.toString({
    colors: true,
    hash: false,
    version: true,
    timings: true,
    assets: true,
    chunks: false,
    children: false
  }) + '\n\n')
})
