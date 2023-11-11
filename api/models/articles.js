const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: {
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
  author: {
    type: String
  },
  content: {
    type: String
  },
  date: {
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

module.exports = mongoose.model('articles', ArticleSchema)
