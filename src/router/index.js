// const comment = require('./comment')
// const user = require('./user')
// const auth = require('./auth')
// const upload = require('./upload')
// const userLikeRecord = require('./user_like_record')

const routers = [
  require('./comment'),
  require('./user'),
  require('./auth'),
  require('./upload'),
  require('./user_like_record'),
]
class Router {
  depoly(app) {
    routers.forEach((route) => {
      app.use(route.routes())
      app.use(route.allowedMethods())
    })
  }
}

module.exports = new Router()
