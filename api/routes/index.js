const express = require('express')
const router = express.Router()
const { getDeskItems, deleteDeskItem, createDeskItem, editDeskItem, testTemplates, ordenaDesks, cagadasFix, getSidePanel } = require('../controllers/escritorios')
router.get('/', (req, res) => {
  res.render('landing.pug')
})
router.get('/templates', testTemplates)
router.get('/escritorios', getDeskItems)
module.exports = router
