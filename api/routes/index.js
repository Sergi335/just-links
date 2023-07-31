const express = require('express')
const router = express.Router()
const { registraUsuario, compruebaUsuario, eliminaUsuario, cambiaPassword } = require('../controllers/auth')
const { getDeskItems } = require('../controllers/escritorios')
router.get('/', (req, res) => {
  res.render('landing.pug')
})
router.get('/escritorios', getDeskItems)
router.post('/register', registraUsuario)
router.post('/login', compruebaUsuario)

module.exports = router
