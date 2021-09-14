const koajwt = require('koa-jwt')

const jwtErrorHandler = async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: err.message,
      }
    } else {
      throw err
    }
  })
}

// 不需要验证
const path = [
  /^\/user\/login/,
  /^\/user\/logout/,
  /^\/user\/auth/,
  /^\/upload/,
  /^\/user\/validate/,
  /^\/article\/insert/,
]

module.exports = {
  jwtErrorHandler,
  koajwt: koajwt({ secret: process.env.SECRET }).unless({
    method: 'GET',
    path,
  }),
}
