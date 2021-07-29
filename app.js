const Koa = require('koa')

const app = new Koa()

const middlewares = require('./src/middleware')

middlewares.depoly(app)

const { PORT } = require('./src/config')

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
