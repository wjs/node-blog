const mongo = require('koa-mongo')
const Router = require('koa-router')
const site = new Router({
  prefix: '/links'
})
const utils = require('../../common/utils')
const linksService = require('../../service/links')

links
.get('/', utils.LoginMiddleware, async (ctx, next) => {
  ctx.body = await linksService.getAll(ctx.mongo)
})
.post('/', utils.LoginMiddleware, async (ctx, next) => {
  // name, link
  const { name, link } = ctx.request.body
  if (name && link) {
    ctx.body = await linksService.add(ctx.mongo, { name, link })
  } else {
    ctx.body = 'add failed: name or link is empty!'
  }
})
.put('/:id', utils.LoginMiddleware, async (ctx, next) => {
  const { name, link } = ctx.request.body
  if (name && link) {
    ctx.body = await linksService.update(ctx.mongo, this.params.id, { name, link })
  } else {
    ctx.body = 'update failed: name or link is empty!'
  }
})

module.exports = links
