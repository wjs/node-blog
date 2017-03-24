const Router = require('koa-router')
const links = new Router({
  prefix: '/links'
})
const config = require('../../config')
const siteService = require('../../service/site')

links
.get('/', async ctx => {
  let site = await siteService.get(ctx.mongo)
  site = site || {}

  await ctx.render('links', {
    links: site.links || [],
    site: {
      sitename: site.sitename,
      pagesize: site.pagesize,
      admin: site.admin,
      github: site.github
    },
    pageTitle: site.sitename,
    staticUrl: {
      'app.css': config.staticUrl['app.css'],
      'app.js': config.staticUrl['app.js']
    }
  })
})

module.exports = links
