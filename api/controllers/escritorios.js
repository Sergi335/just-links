const { escritoriosModel, columnasModel, linksModel } = require('../models/index')

const getDeskItems = async (req, res) => {
  const data = await escritoriosModel.find()
  res.send(data)
}
const testTemplates = async (req, res) => {
  console.log(req.query.mode)
  const params = req.query.escritorio
  console.log('🚀 ~ file: escritorios.js:124 ~ testTemplates ~ params:', params)
  const user = req.cookies.user
  // User new? if si crear dummy content
  // let isNewUser = await usersModel.find({ name: `${user}` })
  // const userImg = isNewUser[0].profileImage
  // isNewUser = isNewUser[0].newUser
  // console.log(`Es nuevo usuario? ${isNewUser}`)
  // if (isNewUser) {
  //   // Insertar en DB
  //   await createDummyContent(user)
  // }
  const escritorios = await escritoriosModel.find({ user }).sort({ orden: 1 })
  // console.log(escritorios)
  let escritorio
  if (params) {
    escritorio = params
  } else if (escritorios.length > 0) {
    escritorio = escritorios[0].name
  } else {
    escritorio = null
  }
  const existeEscritorio = await escritoriosModel.findOne({ name: escritorio, user })
  if (existeEscritorio === null) {
    console.log('No exite escritorio')
    res.status(404).send({ error: 'not found' })
  }
  // const backgrounds = await getBackgrounds()
  // console.log(backgrounds)
  console.log(escritorio)
  const columnas = await columnasModel.find({ user, escritorio }).sort({ order: 1 })
  const columnasAll = await columnasModel.find({ user }).sort({ order: 1 })
  const links = await linksModel.find({ user, escritorio }).sort({ orden: 1 })
  const mode = req.cookies.mode
  const locals = {
    escritorio,
    escritorios,
    columnas,
    columnasAll,
    links,
    user,
    mode
  }
  if (!req.cookies.mode || req.cookies.mode === 'normal') {
    res.render('indexTemplates.pug', locals)
  } else {
    res.render('indexTemplatesEdit.pug', locals)
  }
}
module.exports = { getDeskItems, testTemplates }
