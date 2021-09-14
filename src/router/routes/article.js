const Router = require('koa-router')
const router = new Router()

const ArtModel = require('../../db/method/article')

router
  .post('/article/insert', async (ctx) => {
  let artInfo = ctx.params
  const art = await ArtModel.save(artInfo)
  if (art) {
    // 返回报文
    ctx.body = {
      code: 1,
      art,
      msg: '添加成功！',
    }
    return
  }
  ctx.body = {
    code: 0,
    msg: '添加失败！',
  }
})
.get('/article/list', async (ctx) => {
  let obj = ctx.params
  const arts = await ArtModel.query(obj)
  if (arts) {
    // 返回报文
    ctx.body = {
      code: 1,
      arts,
      msg: '查询成功！',
    }
    return
  }
  ctx.body = {
    code: 0,
    msg: '查询失败！',
  }
})
.get('/article/detail', async (ctx) => {
  let obj = ctx.params
  const art = await ArtModel.queryById(obj)
  if (art) {
    // 返回报文
    ctx.body = {
      code: 1,
      art,
      msg: '查询成功！',
    }
    return
  }
  ctx.body = {
    code: 0,
    msg: '查询失败！',
  }
})

module.exports = router