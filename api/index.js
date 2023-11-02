const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
// eslint-disable-next-line no-unused-vars
const pug = require('pug')
const publicDir = express.static(path.join('api', 'public'))
const dbConnect = require('./config/mongo')
const viewDir = path.join(__dirname, 'views')
const port = (process.env.port || 3000)
const cookieParser = require('cookie-parser')
const routes = require('./routes/index')

app
// Configurando app
  .set('views', viewDir)
  .set('view engine', 'pug')

app.use(function (req, res, next) {
  const origin = req.header('origin')

  const ACCEPTED_ORIGINS = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']

  if (ACCEPTED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-justlinks-user, x-justlinks-token')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app
  .use(publicDir)
  .use(express.json())
  .use(cookieParser())
  .use('/', routes)

app.listen(port, () => {
  console.log('Eyyy tu app corre por el puerto ' + port)
})

dbConnect()

module.exports = app
