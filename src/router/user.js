const User = require('../db/method/user')

const Router = require('koa-router')

const router = new Router()

router
  // 获取用户列表
  .get('/api/user/list', async (ctx) => {
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
  .post('/api/user/validate', async (ctx) => {
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
  // 用户登录
  .post('/api/user/login', async (ctx) => {
    try {
      const { avatar, nickname, gender, email, weburl, address } =
        ctx.request.body

      const users = await User.query({ nickname })

      const userinfo = await User.query({ nickname, email })

      // 直接登录
      if (users[0] && userinfo[0]) {
        ctx.cookies.set('userId', userinfo[0]['_id'], {
          maxAge: 60 * 60 * 24 * 10000000,
        })
        ctx.body = {
          data: userinfo[0],
          code: 1,
        }
        return
      }

      // 新建用户
      if (!users[0]) {
        const user = await User.save({
          avatar,
          nickname,
          gender,
          email,
          weburl,
          address,
        })
        ctx.cookies.set('userId', user['_id'], {
          maxAge: 60 * 60 * 24 * 10000000,
        })
        ctx.body = {
          data: user,
          code: 1,
        }
        return
      }

      ctx.body = {
        code: 0,
        msg: '用户名与邮箱号不匹配',
      }
    } catch (err) {
      ctx.body = {
        code: 0,
        msg: '用户名与邮箱号不匹配',
        err,
      }
    }
  })
  .post('/api/user/logout', async (ctx) => {
    try {
      ctx.cookies.set('userId', '', { maxAge: 0 })
      ctx.body = {
        code: 1,
      }
    } catch (error) {
      ctx.cookies.set('userId', '', { maxAge: 0 })
      ctx.body = {
        code: 0,
      }
    }
  })

module.exports = router
