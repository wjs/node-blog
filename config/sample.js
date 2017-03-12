const staticManifest = require('../static/dist/manifest.json')

module.exports = {
  serverPort: 3000,
  passwordKey: 'node-blog',  // 加密密码用的，部署时候需要修改
  authKey: 'just some randon words',  // 生成 token 用的，部署时候需要修改
  cookieAuthKey: 'nodeblogauth',  // 存 cookie 的 key
  staticCacheMaxAge: 1000 * 60 * 60 * 24 * 365,
  pageSize: 20,
  mongodb: {
    host: 'localhost',
    port: 27017,
    db: 'blog'
  },
  staticUrl: staticManifest
}
