const Article = require('../schema/article')

const _filter = {
  __v: 0
}

const initKeys = {
  page: 0,
  size: 15,
  sorter: 'createdAt_descend',
}

class ArticleMethod {
  queryById(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(_id)
        const art = await Article.findById(_id, _filter)
        art ? resolve(art) : resolve({})
      } catch (err) {
        reject(err)
      }
    })
  }
  queryOne(obj) {}
  query(obj, keys) {
    return new Promise(async (resolve, reject) => {
      try {
        const arts = await Article.find({
          ...obj
        }, {
          'html': 0,
          ..._filter
        })
        arts && arts.length ? resolve(arts) : resolve([])
      } catch (err) {
        reject(err)
      }
    })
  }
  queryAll(obj, keys) {}
  count(obj) {}
  countAll(obj) {}
  save(obj = {}) {
    const art = new Article(obj)
    return new Promise(async (resolve, reject) => {
      try {
        const result = await art.save()
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }
  delete(_id) {}
  update(_id, obj) {}
}

module.exports = new ArticleMethod()