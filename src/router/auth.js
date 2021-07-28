const Router = require('koa-router')
const router = new Router()
const dayjs = require('dayjs')
const jwt = require('jsonwebtoken')

const UserModel = require('../db/method/user.js')

const secret = 'redloeny-secret'

const checkUser = async (userinfo) => {
  const user = await UserModel.query(userinfo)
  return user[0] ? true : false
}

const getUser = async (userinfo) => {
  const user = await UserModel.queryOne(userinfo)
  return user
}

// 用户登录
router.post('/api/user/login', async (ctx) => {
  // 获取用户数据
  let userinfo = ctx.request.body

  // 判断用户是否存在
  const { nickname, email } = userinfo

  if (await checkUser({ nickname })) {
    // => 用户存在
    const user = await getUser({ nickname, email })

    // 验证用户信息
    if (user == null) {
      ctx.body = {
        code: 1,
        msg: '邮箱不匹配，请检查邮箱是否正确！',
      }
      return
    }

    // 用户存在 id 存储 => cookies
    ctx.cookies.set('userId', user['_id'], {
      maxAge: 60 * 60 * 24 * 10000000,
    })

    userinfo = user
  } else {
    // => 重新创建
    const user = await UserModel.save(userinfo)

    userinfo = user
  }

  let { _id, avatar, gender, weburl, address } = userinfo

  const payload = {
    _id,
    avatar,
    nickname,
    gender,
    email,
    weburl,
    address,
  }

  // 生成token令牌
  const token = jwt.sign(payload, secret, { expiresIn: '30m' })
  // 返回报文
  ctx.body = {
    code: 1,
    msg: '登录成功！',
    warn: '此Token 30m 后过期哦~',
    token,
  }
})

router.post('/api/user/auth', (ctx) => {
  const bearerHeader = ctx.header.authorization
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const token = bearer[1]
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        ctx.body = {
          code: 0,
          err: {
            ...err,
            expiredAt: dayjs(err.expiredAt).format('YYYY-MM-DD - HH:MM:ss'),
          },
        }
        return
      } else {
        ctx.body = {
          code: 1,
          msg: 'Post Created..',
          payload,
        }
      }
    })
  } else {
    ctx.body = {
      code: 0,
      msg: 'Forbidden Token',
    }
  }
})

module.exports = router
