const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const compose = require('koa-compose')
const bodyParser = require('koa-bodyparser')

const { PORT } = require('./src/config')

// 静态文件夹 www
const path = require('path')
const static = require('koa-static')
const staticPath = static(path.join(__dirname, './www'))
const middlewares = compose([bodyParser(), staticPath])

// router config
const routers = require('./src/router')
// jwt config
const jwtDeploy = require('./src/utils/jwt')

app
  .use(staticPath)
  .use(middlewares)
  .use(router.routes())
  .use(router.allowedMethods())

routers.depoly(app)
jwtDeploy.deploy(app)

router.get('/', (ctx) => {
  ctx.body = {
    code: 1,
    msg: 'API请求成功!',
  }
})
router.post('/', (ctx) => {
  ctx.body = {
    code: 1,
    msg: 'API请求成功!',
  }
})

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
