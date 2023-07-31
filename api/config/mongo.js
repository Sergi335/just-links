const mongoose = require('mongoose')
const { DB_URI, DB_URI_TEST, NODE_ENV } = process.env

const dbConnect = () => {
  const connectionString = NODE_ENV === 'test'
    ? DB_URI_TEST
    : DB_URI
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((res) => {
    console.log('***** CONEXION CORRECTA *****')
  }).catch((err) => {
    console.log('***** ERROR DE CONEXION *****', err)
  })
}

module.exports = dbConnect
