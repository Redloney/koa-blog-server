const jwt = require('jsonwebtoken')

const dayjs = require('dayjs')

const secret = process.env.SECRET

// 生成 Token
const produceToken = (payload) => {
  try {
    const token = jwt.sign(payload, secret, { expiresIn: '30m' })
    return token
  } catch (err) {
    throw err
  }
}

// 验证 Token
const verifyToken = (token) => {
  let verify
  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      verify = {
        code: 0,
        err: {
          ...err,
          expiredAt: dayjs(err.expiredAt).format('YYYY-MM-DD-HH:MM:ss'),
        },
      }
    } else {
      verify = {
        code: 1,
        msg: 'Token 验证通过！',
        payload,
      }
    }
  })
  return verify
}

module.exports = {
  produceToken,
  verifyToken,
}
