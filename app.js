const koa = require('koa')
const app = new koa()

const compose = require('koa-compose')
const bodyParser = require('koa-bodyparser')
// const cors = require('koa2-cors')

// 静态文件夹 www
const path = require('path')
const static = require('koa-static')
const staticPath = static(path.join(__dirname, './www'))
const middlewares = compose([bodyParser(), staticPath])
// 路由 router
const router = require('./src/router')
const comment = require('./src/router/comment')
const user = require('./src/router/user')
const upload = require('./src/router/upload')

app
  // .use(cors({
  //   origin: ctx => {
  //     return 'https://www.redloney.cn'
  //   },
  //   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  //   maxAge: 5,
  //   credentials: true,
  //   allowMethods: ['GET', 'POST', 'DELETE'],
  //   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  // }))
  .use(staticPath)
  .use(middlewares)
  .use(router.routes())
  .use(router.allowedMethods())
  .use(user.routes())
  .use(user.allowedMethods())
  .use(comment.routes())
  .use(comment.allowedMethods())
  .use(upload.routes())
  .use(upload.allowedMethods())

const port = process.env.PORT || 8082

app.listen(port, () => {
  console.log(`server started on ${port}`)
})
