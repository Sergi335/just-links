const mongoose = require('mongoose')

const DesktopSchema = new mongoose.Schema({
  name: {
    type: String
  },
  user: {
    type: String
  },
  orden: {
    type: Number
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model('escritorios', DesktopSchema)
