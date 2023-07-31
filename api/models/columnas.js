const mongoose = require('mongoose')

const ColumnSchema = new mongoose.Schema({
  name: {
    type: String
  },
  escritorio: {
    type: String
  },
  vacio: {
    type: Boolean
  },
  order: {
    type: Number
  },
  user: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model('columnas', ColumnSchema)
