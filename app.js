const express = require('express')
const path = require('path')
const viewDir = path.join(__dirname, 'views')
const publicDir = express.static(path.join(__dirname, 'public'))
const port = (process.env.port || 3000)
const app = express()

app
// Configurando app
  .set('views', viewDir)
  .set('view engine', 'pug')
app
  .use(publicDir)
app.listen(port, () => {
    console.log('Eyyy tu app corre por el puerto ' + port)
})

app.get('/', (req, res) => {
    res.render('index.pug')
})