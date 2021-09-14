const User = require('../../db/method/user')

const Router = require('koa-router')

const router = new Router()

router
  // 获取用户列表
  .get('/user/list', async (ctx) => {
    try {
      const { page, size, sorter, ...args } = ctx.query
      const users = await User.query(args, { page, size, sorter })
      const count = await User.count(args)
      users
        ? (ctx.body = {
            users: users ? users : [],
            code: 1,
            count,
          })
        : (ctx.body = { code: 0 })
    } catch (err) {
      console.log(err)
    }
  })
  .post('/user/validate', async (ctx) => {
    try {
      const userinfo = ctx.request.body
      let users = await User.query(userinfo)
      users && users[0]
        ? (ctx.body = {
            code: 1,
            count: users.length,
          })
        : (ctx.body = {
            code: 0,
          })
    } catch (err) {
      ctx.body = {
        code: 0,
        err,
        msg: 'got error !',
      }
    }
  })
  .post('/user/logout', async (ctx) => {
    try {
      ctx.cookies.set('userId', '', { maxAge: 0 })
      ctx.body = {
        code: 1,
        msg: '注销成功！',
      }
    } catch (error) {
      ctx.cookies.set('userId', '', { maxAge: 0 })
      ctx.body = {
        code: 0,
      }
    }
  })

module.exports = router
