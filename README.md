# node-blog

练手项目，Node.js 写的个人博客系统，后端 Koa2 + mongodb，博客首页 jQuery， 博客后台管理页 Vue + element。

[Live Demo](https://wjs92.cf)

## 部署

如果想在自己的机器上部署，需要安装如下软件

- mongodb
- Node 版本 >= 7.6
- pm2 （可以使用 forever 等代替）

```bash
git clone https://github.com/wjs/node-blog.git
cd node-blog
npm i --production
cp config/sample.js config/index.js
vi config/index.js  # 修改对应配置项
pm2 start app.js -i max
# 推荐配合 nginx 部署
```

首次访问，请先进入后台管理入口进行站点初始化。

- 博客系统前台入口： `/`
- 博客系统后台管理入口： `/admin`

## 使用方法

如果博客功能不足或者主题不适合，欢迎 fork 项目之后自己修改，顺便给个 star

```bash
npm start # 起 server
npm run dev # 编译前端静态
npm run build # 打包前端静态
```

## Todo

- [x] 博客前台基本功能：列表页（分页），详情页，emoji 支持
- [x] 博客后台管理功能：站点初始化，管理员登录，博客增删改查，站点和管理员信息管理
- [ ] markdown 编辑器优化
- [ ] 博客查找
- [ ] 图片上传
- [ ] 个人信息展示
- [ ] 兼容手机端
- [ ] 缓存
- [ ] 数据备份还原

## License

MIT