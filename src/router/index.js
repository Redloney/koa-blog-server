const koaRouter = require('koa-router')
const router = new koaRouter()

router
  .get('/', async ctx => {
    ctx.body = {
      code: 1,
      msg: 'API请求成功!'
    }
  })
  .post('/', async ctx => {
    ctx.body = {
      code: 1,
      msg: 'API请求成功!'
    }
  })

module.exports = router