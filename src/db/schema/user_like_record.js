const mongoose = require('../db')
const Schema = mongoose.Schema

// target_type
// 0 留言
// 1 留言评论
// 2 文章评论
// 3 文章子评论

const UserLikeRecord = new Schema(
  {
    target_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    target_type: {
      type: Number,
      default: 0,
    },
    like_status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

module.exports = mongoose.model(
  'UserLikeRecord',
  UserLikeRecord,
  'UserLikeRecord'
)
