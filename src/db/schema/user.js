const mongoose = require('../db')

const UserSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      required: false,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: false,
      defalut: 'secret',
    },
    weburl: {
      type: String,
      required: false,
    },
    birthday: {
      type: Date,
      required: false,
    },
    address: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

mongoose.set('useCreateIndex', true)

const User = mongoose.model('User', UserSchema, 'User')

module.exports = User
