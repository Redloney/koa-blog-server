const cors = require('koa2-cors')

module.exports = cors({
  origin: () => 'https://www.redloney.cn',
  maxAge: 5,
  credentials: true,
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
})
