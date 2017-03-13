const mongo = require('koa-mongo')
const multer = require('koa-multer')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const moment = require('moment')
const Router = require('koa-router')
const posts = new Router({
  prefix: '/posts'
})
const config = require('../../config')
const utils = require('../../common/utils')
const postService = require('../../service/posts')

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      mkdirp(config.uploadImagePath, function (err) { })
      cb(null, config.uploadImagePath)
    },
    filename: function (req, file, cb) {
      const originalName = file.originalname.split('.')
      cb(null, `${originalName[0]}-${moment().format('YYYYMMDDHHmmssSSS')}.${originalName[1]}`)
    }
  })
})

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
.post('/upload-img', upload.single('file'), async ctx => {
  // 这里可能会坑，multer 把结果挂到了 req 上，而不是 request
  // issue 见：https://github.com/koa-modules/multer/issues/14
  const now = moment()
  if (ctx.req &&　ctx.req.file) {
    // 将上传的图片重命名，并归类到年月的文件夹下
    console.log(ctx.req.file)
    const dirPath = `${path.resolve(config.uploadImagePath)}/${now.year()}/${now.month() + 1}`
    mkdirp(dirPath, function (err) { })

    const oldFileName = path.resolve(ctx.req.file.path)
    const newFileName = `${dirPath}/${ctx.req.file.filename}`
    await fs.renameSync(oldFileName, newFileName)
  }
  ctx.body = `/static/${now.year()}/${now.month() + 1}/${ctx.req.file.filename}`
})

module.exports = posts
