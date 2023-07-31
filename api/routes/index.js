const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('landing.pug')
})
module.exports = router
