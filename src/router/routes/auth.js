const Router = require('koa-router')
const router = new Router()

const UserModel = require('../../db/method/user')

const { produceToken, verifyToken } = require('../../utils/token')

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
  let userinfo = ctx.params

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

  // 生成token令牌
  const token = produceToken({
    _id,
    avatar,
    nickname,
    gender,
    email,
    weburl,
    address,
  })

  // 返回报文
  ctx.body = {
    code: 1,
    msg: '登录成功！',
    warn: '此Token 30m 后过期!',
    token,
  }
})

router.post('/api/user/auth', (ctx) => {
  const bearerHeader = ctx.header.authorization
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const token = bearer[bearer.length - 1]

    const verify = verifyToken(token)
    ctx.body = {
      ...verify,
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '未得到Token授权 禁止访问！',
    }
  }
})

module.exports = router
