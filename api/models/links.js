const mongoose = require('mongoose')

const LinkSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String,
    default: 'Description'
  },
  URL: {
    type: String
  },
  imgURL: {
    type: String
  },
  escritorio: {
    type: String
  },
  panel: {
    type: String
  },
  idpanel: {
    type: String
  },
  orden: {
    type: Number
  },
  user: {
    type: String
  },
  notes: {
    type: String
  },
  images: {
    type: Array
  }
}, {
  timestamps: true,
  versionKey: false
})

LinkSchema.index({ name: 'text' })

module.exports = mongoose.model('links', LinkSchema)
