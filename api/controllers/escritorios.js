const { escritoriosModel } = require('../models/index')

const getDeskItems = async (req, res) => {
  const data = await escritoriosModel.find()
  res.send(data)
}

module.exports = { getDeskItems }
