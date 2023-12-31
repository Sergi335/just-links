const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
  name: {
    type: String
  },
  realName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  newUser: {
    type: Boolean
  },
  profileImage: {
    type: String
  },
  signMethod: {
    type: String
  },
  googleId: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model('usuarios', UsersSchema)
