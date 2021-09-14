const Router = require('koa-router')

const router = new Router()

router.post('/upload', (ctx) => {
  try {
    let imgUrl = 'http://localhost:8088/uploads/' + ctx.uploadpath.file
    ctx.body = {
      code: 1,
      name:ctx.uploadpath.file,
      imgUrl,
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
