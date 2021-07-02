const mongoose = reuqire('../db')
const Schema = mongoose.Schema

// const CommentSchema = new Schema({
//   userinfo:{}
// })

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    thumbNum: {
      type: Number,
      required: false,
    },
    comments: {},
    watchNum: {
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