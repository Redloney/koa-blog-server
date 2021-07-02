const Comment = require('../db/method/comment')
const User = require('../db/method/user')
const Router = require('koa-router')
const filter = require('../utils/utils')

const router = new Router()

router
  // 所有留言 包含被删除
  .get('/api/comments', async (ctx) => {
    let { page, size, sorter, ...obj } = ctx.query
    const comments = await Comment.queryAll(obj, { page, size, sorter })
    const count = await Comment.countAll()
    comments
      ? (ctx.body = {
          comments: comments ? comments : [],
          code: 1,
          count,
        })
      : (ctx.body = { code: 0 })
  })
  // 未被删除的所有留言
  .get('/api/comment/list', async (ctx) => {
    let { page, size, sorter, ...args } = ctx.query
    const comments = await Comment.query(args, { page, size, sorter })
    const count = await Comment.count()
    comments
      ? (ctx.body = {
          comments: comments ? comments : [],
          code: 1,
          count,
        })
      : (ctx.body = { code: 0 })
  })
  // 点赞评论
  .post('/api/comment/thumb', async (ctx) => {
    let _id = ctx.cookies.get('userId')
    // 用户
    let { id, fId, isThumb } = ctx.request.body
    if (id === fId) {
      console.log('主评论')
    } else {
      console.log('子评论')
    }
    ctx.body = {
      code: 0,
    }
  })
  // 添加评论
  .post('/api/comment/insert', async (ctx) => {
    let _id = ctx.cookies.get('userId')
    let { content, replyId } = ctx.request.body
    if (!content) {
      ctx.body = {
        code: 0,
        msg: '评论为空！',
      }
      return
    }
    if (!filter(content)) {
      ctx.body = {
        code: 0,
        msg: '包含违禁词！',
      }
      return
    }
    const userinfo = await User.queryById(_id)
    const comm = { userinfo, content }
    if (replyId) {
      console.log('回复呀')
    }
    let result = replyId
      ? await Comment.update(replyId, { ...comm, isDel: false })
      : await Comment.create(comm)
    ctx.body = {
      comment: result,
      code: 1,
    }
  })
  // 删除评论
  .post('/api/comment/delete', async (ctx) => {
    let _id = ctx.cookies.get('userId')
    let { id, fId } = ctx.request.body
    if (_id && id) {
      const result = await Comment.delete(fId, id)
      ctx.body = {
        isDel: Boolean(result),
        code: result ? 1 : 0,
      }
      return
    }
    ctx.body = {
      code: 0,
    }
  })

module.exports = router
