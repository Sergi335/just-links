const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
// eslint-disable-next-line no-unused-vars
const pug = require('pug')
const favicon = require('serve-favicon')
const faviconURL = path.join(__dirname, 'public', 'img', 'favicon.ico')
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
app
  .use(publicDir)
  .use(favicon(faviconURL))
  .use(express.json())
  .use(cookieParser())
  .use('/', routes)

app.listen(port, () => {
  console.log('Eyyy tu app corre por el puerto ' + port)
})

dbConnect()

module.exports = app
