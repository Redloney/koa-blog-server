const mongoose = require('../db')
const Schema = mongoose.Schema

const ChildrenSchema = new Schema(
  {
    userinfo: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbNum: {
      type: Number,
      default: 0,
    },
    commNum: {
      type: Number,
      default: 0,
    },
    isThumb: {
      type: Boolean,
      default: false,
    },
    isDel: {
      type: Boolean,
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

const CommentSchema = new Schema(
  {
    userinfo: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    children: [ChildrenSchema],
    thumbNum: {
      type: Number,
      default: 0,
    },
    commNum: {
      type: Number,
      default: 0,
    },
    isThumb: {
      type: Boolean,
      default: false,
    },
    isDel: {
      type: Boolean,
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

const Comment = mongoose.model('Comment', CommentSchema, 'Comment')

module.exports = Comment
