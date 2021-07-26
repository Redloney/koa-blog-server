const Comment = require('../schema/comment')

// 过滤字段
const _filter = {
  __v: 0,
  del_status: 0,
  'children.del_status': 0,
}

// 初始化字段
const initKeys = {
  page: 0,
  size: 15,
  sorter: 'createdAt_descend',
}

class CommentMethod {
  // 统计全部评论
  countAll(args) {
    return new Promise((resolve, reject) => {
      Comment.find(
        {
          ...args,
        },
        _filter
      ).exec((err, res) => {
        if (err) reject(err)
        res && res.length ? resolve(res.length) : resolve(0)
      })
    })
  }

  // 统计未被删除评论
  count(obj) {
    return new Promise((resolve, reject) => {
      Comment.find(
        {
          ...obj,
          del_status: 0,
        },
        _filter
      ).exec((err, res) => {
        if (err) reject(err)
        res && res.length ? resolve(res.length) : resolve(0)
      })
    })
  }

  // 查询评论 by id
  queryById(_id) {
    return new Promise((resolve, reject) => {
      Comment.findById(_id, (err, res) => {
        if (err) reject(err)
        res ? resolve(res) : resolve(null)
      })
    })
  }

  query(match, keys) {
    const {
      page = 0,
      size = 15,
      sorter = 'createdAt_descend',
    } = keys ? keys : initKeys

    const sortKey = sorter.split('_')[0]

    const sortVal = sorter.split('_')[1] === 'ascend' ? 1 : -1

    return new Promise((resolve, reject) => {
      Comment.aggregate([
        {
          $match: {
            ...match,
            del_status: 0,
          },
        },
        {
          $project: {
            userinfo: 1,
            content: 1,
            like_status: 1,
            like_number: 1,
            del_status: 1,
            createdAt: 1,
            updatedAt: 1,
            children: {
              $filter: {
                input: '$children',
                as: 'children',
                cond: {
                  $eq: ['$$children.del_status', 0],
                },
              },
            },
          },
        },
      ])
        .sort({
          [sortKey]: sortVal,
        })
        .skip(Number(page * size))
        .limit(Number(size))
        .exec((err, res) => {
          if (err) reject(err)
          res && res.length === 0 ? resolve([]) : resolve(res)
        })
    })
  }

  queryAll(match, keys) {
    return new Promise((resolve, reject) => {
      try {
        const {
          page = 0,
          size = 15,
          sorter = 'createdAt_descend',
        } = keys ? keys : initKeys
        const sortKey = sorter.split('_')[0]
        const sortVal = sorter.split('_')[1] === 'ascend' ? 1 : -1
        Comment.aggregate([
          {
            $match: match,
          },
          {
            $project: _filter,
          },
        ])
          .sort({
            [sortKey]: sortVal,
          })
          .skip(Number(page * size))
          .limit(Number(size))
          .exec((err, res) => {
            if (err) reject(err)
            res && res.length === 0 ? resolve([]) : resolve(res)
          })
      } catch (err) {
        resolve([])
      }
    })
  }

  create(comm_info) {
    return new Promise(async (resolve, reject) => {
      try {
        const comment = new Comment(comm_info)
        const new_comm = await comment.save()
        resolve(new_comm)
      } catch (err) {
        reject(err)
      }
    })
  }

  delete(fId, _id) {
    return new Promise(async (resolve, reject) => {
      try {
        let comm_info =
          fId === _id
            ? await Comment.findByIdAndUpdate(fId, {
                del_status: 1,
              })
            : await Comment.findOneAndUpdate(
                {
                  _id: fId,
                  children: {
                    $elemMatch: {
                      _id,
                    },
                  },
                },
                {
                  $set: {
                    'children.$.del_status': 1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                  fields: _filter,
                }
              )
        resolve(comm_info)
      } catch (err) {
        reject(err)
      }
    })
  }
  // 只做评论添加功能
  update(_id, info) {
    return new Promise(async (resolve, reject) => {
      try {
        const comment = await Comment.findByIdAndUpdate(
          _id,
          {
            $push: {
              children: {
                ...info,
              },
            },
          },
          {
            upsert: true,
            new: true,
            fields: _filter,
          }
        )
        resolve(comment)
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = new CommentMethod()
