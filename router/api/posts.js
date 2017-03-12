const mongo = require('koa-mongo')
const Router = require('koa-router')
const posts = new Router({
  prefix: '/posts'
})
const utils = require('../../common/utils')
const postService = require('../../service/posts')

posts
.get('/', async (ctx, next) => {
  ctx.body =  await postService.getList(ctx.mongo, {
    pageIndex: ctx.query.pageIndex || 1
  })
})
.post('/', utils.LoginMiddleware, async (ctx, next) => {
  const post = Object.assign({
    createtime: Date.now(),
    updatetime: Date.now()
  }, ctx.request.body)
  const result = await postService.add(ctx.mongo, post)
  ctx.body = result.ops[0]._id.toString()
})
.get('/:id', async (ctx, next) => {
  ctx.body = await postService.get(ctx.mongo, ctx.params.id)
})
.put('/:id', utils.LoginMiddleware, async (ctx, next) => {
  const post = Object.assign({ updatetime: Date.now() }, ctx.request.body)
  delete post._id
  ctx.body = await postService.update(ctx.mongo, ctx.params.id, post)
})
.del('/:id', utils.LoginMiddleware, async (ctx, next) => {
  ctx.body = await postService.del(ctx.mongo, ctx.params.id)
})

module.exports = posts
