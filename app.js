const { PORT } = require('./config')

const Koa = require('koa')
const app = new Koa()

const middlewares = require('./src/middleware')

middlewares.depoly(app)

app.listen(PORT, () => {
  console.log(` server started success`)
  console.log(` http://localhost:${PORT}`)
})
