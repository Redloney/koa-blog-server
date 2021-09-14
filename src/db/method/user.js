const User = require('../schema/user')

const _filter = { __v: 0, email: 0 }

const initKeys = {
  page: 0,
  size: 15,
  sorter: 'createdAt_descend',
}

class UserMethod {
  //  根据ID查询用户
  queryById(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const userinfo = await User.findById(_id)
        userinfo ? resolve(userinfo) : resolve({})
      } catch (err) {
        reject(err)
      }
    })
  }
  queryOne(obj) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne(obj, _filter)
        resolve(user)
      } catch (err) {
        reject(err)
      }
    })
  }
  // 查询
  query(args, keys) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          page = 0,
          size = 15,
          sorter = 'createdAt_descend',
        } = keys ? keys : initKeys
        const sortKey = sorter.split('_')[0]
        const sortVal = sorter.split('_')[1] === 'ascend' ? 1 : -1
        const users = await User.aggregate([
          {
            $match: args,
          },
          {
            $project: _filter,
          },
        ])
          .sort({
            [sortKey]: sortVal,
          })
          .skip(page * size)
          .limit(size)
        users && users.length > 0 ? resolve(users) : resolve([])
      } catch (err) {
        reject(err)
      }
    })
  }
  count(obj) {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.find({ ...obj }, _filter)
        users && users.length ? resolve(users.length) : resolve(0)
      } catch (err) {
        reject(err)
      }
    })
  }
  // 新建
  save(info = {}) {
    const user = new User(info)
    return new Promise(async (resolve, reject) => {
      try {
        const result = await user.save()
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = new UserMethod()
