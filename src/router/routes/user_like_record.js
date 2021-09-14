const koaRouter = require('koa-router')
const router = new koaRouter()

const UserLikeRecord = require('../../db/method/user_like_record')

router
  .get('/comment/user_like_records', async (ctx) => {
    // 获取用户Id
    // let _id = ctx.cookies.get('userId')
    // let { page, size, sorter, ...args } = ctx.query
    const user_like_records = await UserLikeRecord.query()
    ctx.body = {
      code: 1,
      user_like_records,
    }
  })
  .get('/comment/user_like_record_groups', async (ctx) => {
    let _id = ctx.cookies.get('userId')
    const user_like_groups = await UserLikeRecord.queryByGroup(_id)
    ctx.body = {
      code: 1,
      user_like_groups,
    }
  })
  .get('/comment/user_like_record_tatal', async (ctx) => {
    let { target_id } = ctx.query
    const user_like_record_total = await UserLikeRecord.count(target_id)
    ctx.body = {
      code: 1,
      user_like_record_total: user_like_record_total.length,
    }
  })
  .post('/comment/user_like', async (ctx) => {
    // 获取用户ID
    let user_id = ctx.cookies.get('userId')

    const { target_id, target_type = 0, like_status = 1 } = ctx.request.body

    if (!target_id) {
      ctx.body = {
        code: 0,
        msg: '点赞目标为空！',
      }
      return
    }

    /**
     *  一个用户 同一条评论 不能点赞两次 第二次销毁点赞数据 (真删除)
     *  此处查询 评论ID && 评论用户ID 结果只会有一条
     */

    const likeInfo = await UserLikeRecord.check({ target_id, user_id })

    if (likeInfo[0]) {
      const likeRecord = await UserLikeRecord.unlike({
        target_id,
        user_id,
      })
      ctx.body = {
        code: 1,
        likeRecord,
        msg: '取消点赞成功！',
      }
      return
    }

    /**
     *  每次点赞都是新增一条点赞数据
     *  同一条评论 同一个用户 不能生成第二条数据 target_id user_id 是唯一
     */

    const likeRecord = await UserLikeRecord.like({
      target_id,
      user_id,
      target_type,
      like_status,
    })

    ctx.body = {
      code: 1,
      msg: '点赞成功！',
      likeRecord,
    }
  })
// // 点赞评论
// .post('/comment/thumb', async (ctx) => {
//   // 1.获取当前用户id
//   let _id = ctx.cookies.get('userId')
//   if (!_id) {
//     ctx.body = {
//       code: 0,
//       msg: '请您先登录！',
//     }
//     return
//   }
//   // 2.获取评论id 父评论id 是否点赞
//   let { id } = ctx.request.body
//   if (!id) {
//     ctx.body = {
//       code: 0,
//       msg: ' 请检查留言是否存在！',
//     }
//     return
//   }

//   if (await CommThumb.queryById(id)) {
//     // 3.如果评论存在
//     const commThumb = await CommThumb.update(id)
//     ctx.body = {
//       commThumb,
//       code: 0,
//     }
//     return
//   } else {
//     // 3.若是第一次评论则创建
//     let commthumb = await CommThumb.create({
//       commId: id,
//       userId: _id,
//       isThumb: true,
//     })
//     ctx.body = {
//       code: 1,
//       commthumb,
//     }
//     return
//   }

//   // 4.如若不然则更新之前的数据
//   ctx.body = {
//     code: 0,
//   }
// })

module.exports = router
