const mongoose = require('../db')
const Schema = mongoose.Schema
// const random = require('string-random')

const ChildComment = new Schema(
  {
    userinfo: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    like_status: {
      type: Number,
      default: 0,
    },
    like_number: {
      type: Number,
      default: 0,
    },
    del_status: {
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

const Comment = new Schema(
  {
    userinfo: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    like_status: {
      type: Number,
      default: 0,
    },
    like_number: {
      type: Number,
      default: 0,
    },
    del_status: {
      type: Number,
      default: 0,
    },
    children: [ChildComment],
    children_count: Number,
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

module.exports = mongoose.model('Comment', Comment, 'Comment')
