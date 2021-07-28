const koajwt = require('koa-jwt')

class JwtConfig {
  deploy(app) {
    app.use(async (ctx, next) => {
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
    })

    app.use(
      koajwt({ secret: process.env.SECRET }).unless({
        // 登录接口不需要验证
        path: [/^\/api\/user\/login/, /^\/api\/user\/validate/],
      })
    )
  }
}
module.exports = new JwtConfig()
