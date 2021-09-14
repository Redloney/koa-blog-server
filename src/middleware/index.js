const { resolve } = require('path')

// 静态文件夹
const static = require('koa-static')
const staticPath = static(resolve('./www'))
// 后端跨域
const cros = require('./cros')

// 中间件
const koaBody = require('./koabody')
const koaError = require('./koaError')
// const mapParams = require('./custom')
const { jwtErrorHandler, koajwt } = require('./jwt')
// 组合
const compose = require('koa-compose')

// 中间件集合
const middlewares = compose([
  koaError,
  cros,
  koajwt,
  jwtErrorHandler,
  staticPath,
])

// 路由
const routers = require('../router')

class Middleware {
  depoly(app) {
    koaBody(app)
    routers(app)
    app.use(middlewares)
  }
}

module.exports = new Middleware()
