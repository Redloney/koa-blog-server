const mongoose = require('../db')
const Schema = mongoose.Schema

const ArticleSchema = new Schema(
  {
    // 标题
    title: {
      type: String,
      required: true,
    },
    // 作者
    author: {
      type: String,
      required: true,
    },
    // 描述
    desc: {
      type: String,
      required: true,
    },
    // 内容
    html: {
      type: String,
      required: true,
    },
    // 封面图片
    cover: {
      type: String,
      required: true,
    },
    // 点赞
    thumbNum: {
      type: Number,
      required: false,
    },
    // 查看
    watchNum: {
      type: Number,
      required: false,
    },
    // 状态
    artState: {
      type: Number,
      required: false,
    },
    // 分类
    classify: {
      type: Number,
      required: false,
    },
    isDel: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

const Article = mongoose.model('Article', ArticleSchema, 'Article')

module.exports = Article
