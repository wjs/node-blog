const crypto = require('crypto')
const config = require('../config')
const siteService = require('../service/site')


const utils = {
  encryPassword (password) {
    var hash = crypto.createHash('sha256')
    hash.update(password + config.passwordKey)
    hash = hash.digest('hex')
    return hash
  },
  async login (ctx, username, password) {
    const site = await siteService.get(ctx.mongo)
    const hashPassword = this.encryPassword(password)
    if (site.admin === username && site.password === hashPassword) {
      let encrypted = ''
      const originToken = `${username}|${hashPassword}|${ctx.ip}`
      const cipher = crypto.createCipher('rc4', config.authKey)
      encrypted += cipher.update(originToken, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      ctx.cookies.set(config.cookieAuthKey, encrypted)
      return true
    }
    return false
  },
  async isLogin (ctx) {
    const token = ctx.cookies.get(config.cookieAuthKey)
    if (!token) {
      return false
    }
    let decrypted = ''
    const decipher = crypto.createDecipher('rc4', config.authKey)
    decrypted += decipher.update(token, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    const [username, password, ip] = decrypted.split('|')
    if (!ip || ip != ctx.ip) {
      return false
    }

    const site = await siteService.get(ctx.mongo)
    if (site.admin === username && site.password === password) {
      return true
    }
    return false
  },
  // 中间件
  async LoginMiddleware (ctx, next) {
    const isLogin = await utils.isLogin(ctx)
    if (!isLogin) {
      return await ctx.redirect('/admin/login')
    }
    return next()
  }
}

module.exports = utils
