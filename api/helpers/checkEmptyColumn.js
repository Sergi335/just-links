const { linksModel, columnasModel } = require('../models/index')

const checkEmptyColumn = async (user, idpanel, idpanelOrigen) => {
  try {
    const destinyData = await linksModel.countDocuments({ user, idpanel })
    const originData = await linksModel.countDocuments({ user, idpanel: idpanelOrigen })
    if (destinyData > 0) {
      await columnasModel.findOneAndUpdate({ _id: idpanel, user }, { $set: { vacio: false } })
    } else {
      await columnasModel.findOneAndUpdate({ _id: idpanel, user }, { $set: { vacio: true } })
    }
    if (originData && originData > 0) {
      await columnasModel.findOneAndUpdate({ _id: idpanelOrigen, user }, { $set: { vacio: false } })
    } else {
      await columnasModel.findOneAndUpdate({ _id: idpanelOrigen, user }, { $set: { vacio: true } })
    }
  } catch (error) {
    console.log('🚀 ~ file: checkEmptyColumn.js:20 ~ checkEmptyColumn ~ error:', error)
    return error
  }
}
module.exports = { checkEmptyColumn }
