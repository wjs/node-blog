const mongo = require('koa-mongo')
const Router = require('koa-router')
const site = new Router({
  prefix: '/site'
})
const utils = require('../../common/utils')
const siteService = require('../../service/site')

site
.get('/', utils.LoginMiddleware, async (ctx, next) => {
  const site = await siteService.get(ctx.mongo)
  delete site.password
  ctx.body = site
})
.put('/:id', utils.LoginMiddleware, async (ctx, next) => {
  // sitename, admin, password, github
  const site = Object.assign({
    sitename: 'node-blog',
    pagesize: 10,
    admin: 'admin',
    github: ''
  }, ctx.request.body)
  // encry password
  delete site._id

  ctx.body = await siteService.update(ctx.mongo, ctx.params.id, site)
})

module.exports = site
