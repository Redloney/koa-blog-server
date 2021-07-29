const Router = require('koa-router')

const router = new Router()

router.post('/api/upload', (ctx) => {
  try {
    ctx.body = {
      code: 1,
      msg: '上传成功！',
    }
  } catch (err) {
    ctx.body = {
      code: 0,
      err,
      msg: '上传错误!',
    }
  }
})

module.exports = router
