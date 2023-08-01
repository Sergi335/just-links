const express = require('express')
const app = express()
require('dotenv').config()
// const { v4 } = require('uuid')
const path = require('path')
// const pug = require('pug')
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
  .use(express.json())
  .use(cookieParser())
  .use('/', routes)

// app.get('/api', (req, res) => {
//   const path = `/api/item/${v4()}`
//   res.setHeader('Content-Type', 'text/html')
//   res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
//   res.end(`Hello! Go to item: <a href="${path}">${path}</a>`)
// })

// app.get('/api/item/:slug', (req, res) => {
//   const { slug } = req.params
//   res.end(`Item: ${slug}`)
// })

app.listen(port, () => {
  console.log('Eyyy tu app corre por el puerto ' + port)
})

dbConnect()

module.exports = app
