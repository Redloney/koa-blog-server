const mongoose = require('../db')
const Schema = mongoose.Schema

const TagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

const Tag = mongoose.model('Tag', TagSchema, 'Tag')

module.exports = Tag
