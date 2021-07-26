const User = require('../schema/user')
const LikeRecord = require('../schema/user_like_record')

// 过滤字段
const _filter = {
  __v: 0,
}

// 初始化字段
const initKeys = {
  sorter: 'createdAt_descend',
}

class LikeRecordMethod {
  // 统计目标已点赞数
  count(target_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const like_record_total = await LikeRecord.find(
          {
            target_id,
            like_status: 1,
          },
          _filter
        )
        resolve(like_record_total)
      } catch (err) {
        reject(err)
      }
    })
  }
  queryById(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const like_record = await LikeRecord.findOne(
          { target_id: _id },
          _filter
        )
        resolve(like_record)
      } catch (err) {
        reject(err)
      }
    })
  }
  check(where) {
    return new Promise(async (resolve, reject) => {
      try {
        const like_record = await LikeRecord.find(where, _filter)
        resolve(like_record)
      } catch (err) {
        reject(err)
      }
    })
  }
  query(where) {
    return new Promise(async (resolve, reject) => {
      try {
        const like_record = await LikeRecord.find(where, _filter)
        resolve(like_record)
      } catch (err) {
        reject(err)
      }
    })
  }
  queryByGroup(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const like_record = await LikeRecord.aggregate([
          {
            $group: {
              _id: {
                target_id: '$target_id',
                user_id: '$user_id',
                like_status: '$like_status',
              },
              likeTotal: {
                $sum: '$like_status',
              },
            },
          },
        ])
        resolve(like_record)
      } catch (err) {
        reject(err)
      }
    })
  }
  like(link_info) {
    return new Promise(async (resolve, reject) => {
      try {
        const likeRecord = new LikeRecord({ ...link_info })
        const newlikeRecord = await likeRecord.save()
        resolve(newlikeRecord)
      } catch (err) {
        reject(err)
      }
    })
  }
  unlike(where) {
    return new Promise(async (resolve, reject) => {
      try {
        const likeRecord = await LikeRecord.findOneAndDelete(where)
        resolve(likeRecord)
      } catch (err) {
        reject(err)
      }
    })
  }
  update(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        // const Comm = await LikeRecord.findById(_id)
        const LikeRecord = await LikeRecord.findByIdAndUpdate(
          _id,
          {
            $set: {
              isThumb: !Comm.isThumb,
            },
          },
          {
            upsert: true,
            new: true,
            fields: _filter,
          }
        )
        resolve(LikeRecord)
      } catch (err) {
        reject(err)
      }
    })
  }
  // count(_id) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const like_record = await LikeRecord.find(
  //         {
  //           commId: _id,
  //           isThumb: true,
  //         },
  //         _filter
  //       )
  //       like_record && like_record.length
  //         ? resolve(like_record.length)
  //         : resolve(0)
  //     } catch (err) {
  //       reject(err)
  //     }
  //   })
  // }
  // queryById(_id) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const like_record = await LikeRecord.findOne({ commId: _id })
  //       resolve(like_record)
  //     } catch (err) {
  //       reject(err)
  //     }
  //   })
  // }
}

module.exports = new LikeRecordMethod()
