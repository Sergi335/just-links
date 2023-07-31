const express = require('express')
const router = express.Router()
const { getDeskItems } = require('../controllers/escritorios')
router.get('/', (req, res) => {
  res.render('landing.pug')
})
router.get('/escritorios', getDeskItems)

module.exports = router
