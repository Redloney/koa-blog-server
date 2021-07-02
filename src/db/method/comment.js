const Comment = require('../schema/comment')

// 过滤字段
const _filter = {
  __v: 0,
  isDel: 0,
  'children.isDel': 0,
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
          isDel: false,
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

  query(obj, keys) {
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
            ...obj,
            isDel: false,
          },
        },
        {
          $project: {
            content: 1,
            userinfo: 1,
            createdAt: 1,
            thumbNum: 1,
            commNum: 1,
            children: {
              $filter: {
                input: '$children',
                as: 'children',
                cond: {
                  $eq: ['$$children.isDel', false],
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

  queryAll(obj, keys) {
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
            $match: obj,
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

  create(comm) {
    try {
      return new Promise(async (resolve, _reject) => {
        const comment = new Comment(comm)
        const result = await comment.save()
        resolve(result)
      })
    } catch (err) {
      reject(err)
    }
  }

  delete(fId, _id) {
    return new Promise(async (resolve, reject) => {
      try {
        let result =
          fId === _id
            ? await Comment.findByIdAndUpdate(fId, {
                isDel: true,
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
                    'children.$.isDel': true,
                  },
                },
                {
                  upsert: true,
                  new: true,
                  fields: _filter,
                }
              )
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }

  update(_id, obj) {
    try {
      return new Promise(async (resolve, _reject) => {
        const comment = await Comment.findByIdAndUpdate(
          _id,
          {
            $push: {
              children: {
                ...obj,
              },
            },
          },
          {
            upsert: true,
            new: true,
            fields: _filter,
          }
        )
        console.log(comment)
        resolve(comment)
      })
    } catch (err) {
      reject(err)
    }
  }
}

module.exports = new CommentMethod()
