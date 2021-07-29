const { join } = require('path')

// 静态文件夹
const static = require('koa-static')
const staticPath = static(join(__dirname, './www'))

// 后端跨域
const cros = require('./cros')

// 中间件
const koaBody = require('./koabody')
const koaError = require('./koaError')
const custom = require('./custom')
const { jwtErrorHandler, koajwt } = require('./jwt')

const compose = require('koa-compose')

// 中间件集合
const middlewares = compose([
  koaError,
  cros,
  custom,
  koajwt,
  jwtErrorHandler,
  staticPath,
  koaBody,
])

// 路由
const routers = require('../router')

class Middleware {
  depoly(app) {
    app.use(middlewares)
    routers(app)
  }
}

module.exports = new Middleware()
