const moment = require('moment')
const md = require('markdown-it')()
const emoji = require('markdown-it-emoji')
const Router = require('koa-router')
const posts = new Router({
  prefix: '/posts'
})
const config = require('../../config')
const siteService = require('../../service/site')
const postService = require('../../service/posts')

md.use(emoji)

posts
.get(['/', '/page/:pageIndex'], async ctx => {
  let site = await siteService.get(ctx.mongo)
  site = site || {}

  let currentPage = ctx.params.pageIndex || 1
  if (currentPage && typeof currentPage === 'string') {
    try {
      currentPage = parseInt(currentPage)
    } catch (e) {
      // not a number
      currentPage = 1
    }
  }
  if (currentPage < 1) {
    return ctx.redirect('/')
  }
  const posts = await postService.getList(ctx.mongo, {
    pageIndex: currentPage
  })
  posts.data.forEach(item => {
    item.createtime = moment(item.createtime).format('YYYY-MM-DD')
  })
  await ctx.render('index', {
    posts: posts.data,
    site: {
      sitename: site.sitename,
      admin: site.admin,
      github: site.github
    },
    pageConfig: JSON.stringify({
      pageIndex: currentPage
    }),
    pageTitle: site.sitename,
    staticUrl: {
      'app.css': config.staticUrl['app.css'],
      'app.js': config.staticUrl['app.js']
    }
  })
})
// 因为路由长得一样，所以得在 /:id 的前面定义
.get('/pagination', async ctx => {
  ctx.body = {
    pageSize: config.pageSize,
    total: await postService.getTotalCount(ctx.mongo)
  }
})
.get('/:id', async ctx => {
  let site = await siteService.get(ctx.mongo)
  site = site || {}

  let post = null
  try {
    post = await postService.get(ctx.mongo, ctx.params.id)
  } catch (e) {
    // id is not a mongodb ObjectId
    return ctx.redirect('/')
  }
  if (post) {
    post.content = md.render(post.content)
    post.createtime = moment(post.createtime).format('YYYY-MM-DD')
  } else {
    return ctx.redirect('/')
  }

  await ctx.render('detail', {
    post: post || {},
    site: {
      sitename: site.sitename,
      admin: site.admin,
      github: site.github
    },
    pageConfig: JSON.stringify({
      postId: post._id,
    }),
    pageTitle: post.title,
    staticUrl: {
      'app.css': config.staticUrl['app.css'],
      'app.js': config.staticUrl['app.js']
    }
  })
})

module.exports = posts
