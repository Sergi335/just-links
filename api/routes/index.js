const express = require('express')
const router = express.Router()
const { registraUsuario, compruebaUsuario, eliminaUsuario, cambiaPassword } = require('../controllers/auth')
const { getItem, obtenerStatus } = require('../controllers/links')
const { authMiddleware } = require('../middleware/session')
const { getDeskItems, testTemplates } = require('../controllers/escritorios')
router.get('/', (req, res) => {
  res.render('landing.pug')
})
router.get('/linkStatus', authMiddleware, obtenerStatus)
router.get('/link', authMiddleware, getItem)
router.get('/templates', authMiddleware, testTemplates)
router.get('/escritorios', getDeskItems)
router.post('/register', registraUsuario)
router.post('/login', compruebaUsuario)

module.exports = router
