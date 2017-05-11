const logger = require('koa-logger')
const favicon = require('koa-favicon')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const config = require('./config')

const app = new Koa()

app
  .use(logger())
  .use(favicon('build/favicon.ico', { maxAge: config.staticCacheMaxAge }))
  .use(serve('build', { maxAge: config.staticCacheMaxAge }))
  .use(bodyParser())

module.exports = app