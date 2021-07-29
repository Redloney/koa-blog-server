const koaError = require('koa-json-error')

module.exports = koaError({
  postFormat: (_err, { stack, ...rest }) => rest,
  // process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
})
