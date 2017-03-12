const mongo = require('koa-mongo')
const mount = require('koa-mount')
const serve = require('koa-static')
const send = require('koa-send')
const views = require('koa-views')
const favicon = require('koa-favicon')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const app = new Koa()
const config = require('./config')

// mongodb
app.use(mongo(config.mongodb))

// views
app.use(views('./view', { extension: 'ejs' }))

// favicon
app.use(favicon('./view/favicon.ico', { maxAge: config.staticCacheMaxAge }))

// static files
app.use(mount('/static', serve('./static/dist', { maxAge: config.staticCacheMaxAge })))

// bodyparser
app.use(bodyParser())

// page
const postPages = require('./router/page/posts')
app.use(postPages.routes())
// 后面的路由需要管理员登录，这里加个中间件拿管理员信息
const adminPages = require('./router/page/admin')
app.use(adminPages.routes())

// api
const postApis = require('./router/api/posts')
app.use(mount('/api', postApis.routes(), postApis.allowedMethods()))
const siteApis = require('./router/api/site')
app.use(mount('/api', siteApis.routes(), siteApis.allowedMethods()))

// 404
app.use(ctx => {
  // ctx.body = 'This is 404 page! 2333'
  ctx.redirect('/posts')
})

app.listen(config.serverPort)
