const MapParams = async (ctx, next) => {
  ctx.params = {
    ...ctx.request.body,
    ...ctx.query,
  }
  await next()
}

module.exports = MapParams
