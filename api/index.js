const app = require('express')()
const express = require('express')
require('dotenv').config()
const { v4 } = require('uuid')
const path = require('path')
const pug = require('pug')
const publicDir = express.static(path.join(__dirname, 'public'))
const dbConnect = require('./config/mongo')
const viewDir = path.join(__dirname, 'views')
const routes = require('./routes/index')
app
// Configurando app esto no va
  .set('views', viewDir)
  .set('view engine', 'pug')
app
  .use(publicDir)
  .use('/', routes)
// app.get('/', (req, res) => {
//   res.render('index.pug')
// })
app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`)
})

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params
  res.end(`Item: ${slug}`)
})
dbConnect()
module.exports = app
