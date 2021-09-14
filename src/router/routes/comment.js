const Comment = require('../../db/method/comment')
const User = require('../../db/method/user')
const Router = require('koa-router')
const filter = require('../../utils/utils')

const router = new Router()

router

  // 所有留言 包含被删除
  .get('/comments', async (ctx) => {
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
  .get('/comment/list', async (ctx) => {
    let _id = ctx.cookies.get('userId')
    let { page, size, sorter, ...args } = ctx.query
    const comments = await Comment.query(args, { _id, page, size, sorter })

    const count = await Comment.count()

    /**
     *   评论点赞数 ==> 按组 target_id
     *
     *   user_id == id
     *
     */

    comments
      ? (ctx.body = {
          comments: comments ? comments : [],
          code: 1,
          count,
        })
      : (ctx.body = { code: 0 })
  })

  // 添加评论
  .post('/comment/insert', async (ctx) => {
    // 获取用户ID
    let _id = ctx.cookies.get('userId')
    if (!_id) {
      ctx.body = {
        code: 0,
        msg: '请先登录！',
      }
      return
    }
    let { content, replyId } = ctx.request.body
    // 非空
    if (!content) {
      ctx.body = {
        code: 0,
        msg: '评论为空！',
      }
      return
    }
    // 关键词过滤
    if (!filter(content)) {
      ctx.body = {
        code: 0,
        msg: '包含违禁词！',
      }
      return
    }
    // 获取用户信息
    const userinfo = await User.queryById(_id)
    console.log(userinfo)
    // 评论信息
    const comm = { userinfo, content }
    // if (replyId) {
    //   console.log('回复呀')
    // }
    // 判断评论为主评论还是子评论
    let result = replyId
      ? await Comment.update(replyId, { ...comm, isDel: false })
      : await Comment.create(comm)
    ctx.body = {
      comment: result,
      code: 1,
    }
  })
  // 删除评论
  .post('/comment/delete', async (ctx) => {
    let _id = ctx.cookies.get('userId')
    let { id, fId } = ctx.request.body
    // 如果登录了且有删除的目标
    if (_id && id) {
      const status = await Comment.delete(fId, id)
      console.log(status)
      ctx.body = {
        del_status: Boolean(status),
        code: status ? 1 : 0,
      }
      return
    }
    ctx.body = {
      code: 0,
    }
  })

module.exports = router
