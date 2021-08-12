const mongoose = reuqire('../db')
const Schema = mongoose.Schema

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
