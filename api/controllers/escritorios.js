const { escritoriosModel } = require('../models/index')

const getDeskItems = async (req, res) => {
  const data = await escritoriosModel.find()
  res.send(data)
}
const testTemplates = async (req, res) => {
  res.render('indexTemplates.pug')
}
module.exports = { getDeskItems, testTemplates }
