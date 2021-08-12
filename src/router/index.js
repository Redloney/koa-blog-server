const Router = require('koa-router')
const router = new Router()

const routers = [
  require('./routes/comment'),
  require('./routes/user'),
  require('./routes/auth'),
  require('./routes/upload'),
  require('./routes/user_like_record'),
]

module.exports = (app) => {
  app.use(router.routes())
  app.use(router.allowedMethods())

  // default routers
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
