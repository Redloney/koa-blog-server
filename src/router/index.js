const Router = require('koa-router')
const router = new Router()

const routers = [
  require('./comment'),
  require('./user'),
  require('./auth'),
  require('./upload'),
  require('./user_like_record'),
]

module.exports = (app) => {
  app.use(router.routes())
  app.use(router.allowedMethods())
  router.get('/', (ctx) => {
    ctx.body = {
      msg: 'Hello World ~',
    }
  })
  routers.forEach((route) => {
    app.use(route.routes())
    app.use(route.allowedMethods())
  })
}
