const Router = require('koa-router')

// blog router
const blogRouter = new Router({ prefix: '/blog' })

const routing = function (app) {
  app.use(blogRouter.routes())
}

module.exports = routing