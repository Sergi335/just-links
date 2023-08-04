const { escritoriosModel, usersModel } = require('../models/index')
const { linksModel } = require('../models/index')
const { columnasModel } = require('../models/index')
const { createDummyContent } = require('../helpers/createDummyContent')

const cagadasFix = async (req, res) => {
  try {
    // Actualizamos las columnas
    // const filtro = { escritorio: 'Economía', user: 'SergioSR' } // Filtrar documentos
    // console.log(filtro)
    // const actualizacion = { $set: { escritorio: 'economia' } } // Actualizar
    // console.log(actualizacion)

    // await columnasModel.updateMany(filtro, actualizacion)

    // Actualizamos los Links
    const filtroL = { escritorio: 'Economía', user: 'SergioSR' } // Filtrar documentos
    const actualizacionL = { $set: { escritorio: 'test' } } // Actualizar

    await linksModel.updateMany(filtroL, actualizacionL)

    res.send(await escritoriosModel.find({ user: 'SergioSR' }))
  } catch (error) {
    console.log(error) // Manejo de errores
    res.send(error)
  }
}
/**
 * Obtener lista de enlaces
 * @param {*} req
 * @param {*} res
 */
const getDeskItems = async (req, res) => {
  const data = await escritoriosModel.find()
  res.send(data)
}
/**
 * Edita escritorio
 * @param {*} req
 * @param {*} res
 */
const editDeskItem = async (req, res) => {
  const { oldName, newName, newNameFormat } = req.body
  console.log(req.body)
  const user = req.user.name
  const seek = await escritoriosModel.find({ name: newNameFormat, user })
  const err = { error: 'El escritorio ya existe' }
  if (seek.length > 0) {
    res.send(err)
  } else {
    try {
      await escritoriosModel.findOneAndUpdate(
        { name: oldName, user }, // El filtro para buscar el documento
        { $set: { name: newNameFormat, displayName: newName } }, // La propiedad a actualizar
        { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
      )
      // Actualizamos las columnas
      const filtro = { escritorio: oldName, user } // Filtrar documentos
      console.log(filtro)
      const actualizacion = { $set: { escritorio: newNameFormat } } // Actualizar
      console.log(actualizacion)

      await columnasModel.updateMany(filtro, actualizacion)

      // Actualizamos los Links
      const filtroL = { escritorio: oldName, user } // Filtrar documentos
      const actualizacionL = { $set: { escritorio: newNameFormat } } // Actualizar

      await linksModel.updateMany(filtroL, actualizacionL)

      res.send(await escritoriosModel.find({ user }).sort({ orden: 1 }))
    } catch (error) {
      console.log(error) // Manejo de errores
      res.send(error)
    }
  }
}
/**
 * Crea escritorio
 * @param {*} req
 * @param {*} res
 */
const createDeskItem = async (req, res) => {
  const { name, displayName, orden } = req.body
  console.log(req.body)

  const objeto = {}
  objeto.name = name
  objeto.displayName = displayName
  objeto.user = req.user.name
  objeto.orden = orden
  console.log(objeto)
  const seek = await escritoriosModel.find({ name: objeto.name, user: objeto.user })
  const err = { error: 'El escritorio ya existe' }
  if (seek.length > 0) {
    res.send(err)
  } else {
    await escritoriosModel.create(objeto)
    const lista = await escritoriosModel.find({ user: objeto.user }).sort({ orden: 1 })
    res.send(lista)
  }
}
/**
 * Borra escritorio
 * @param {*} req
 * @param {*} res
 */
const deleteDeskItem = async (req, res) => {
  const { name } = req.body
  console.log(req.body)
  const user = req.user.name
  const linksinDesk = await linksModel.deleteMany({ escritorio: name, user })
  const panelsinDesk = await columnasModel.deleteMany({ escritorio: name, user })
  const data = await escritoriosModel.deleteOne({ name, user })
  const lista = await escritoriosModel.find({ user }).sort({ orden: 1 })
  console.log(data)
  console.log(linksinDesk)
  console.log(panelsinDesk)
  res.send(lista)
}
const testTemplates = async (req, res) => {
  const params = req.params.nombre
  const user = req.cookies.user
  console.log('🚀 ~ file: escritorios.js:124 ~ testTemplates ~ params:', params)
  // User new? if si crear dummy content
  let isNewUser = await usersModel.find({ name: `${user}` })
  const userImg = isNewUser[0].profileImage
  isNewUser = isNewUser[0].newUser
  if (isNewUser) {
    // Insertar en DB
    await createDummyContent(user)
  }
  const escritorios = await escritoriosModel.find({ user }).sort({ orden: 1 })
  // console.log(escritorios)
  const deskNames = escritorios.map(desk => ({ displayName: desk.displayName, name: desk.name }))
  console.log('🚀 ~ file: escritorios.js:135 ~ testTemplates ~ deskNames:', deskNames)
  let escritorio
  if (params) {
    escritorio = params
  } else if (escritorios.length > 0) {
    escritorio = escritorios[0].name
  } else {
    escritorio = null
  }
  // escritorio = escritorio.replace(/-/g, ' ').toLowerCase()
  // escritorio = escritorio.toLocaleString()
  console.log('🚀 ~ file: escritorios.js:135 ~ testTemplates ~ escritorio:', escritorio)
  const existeEscritorio = await escritoriosModel.findOne({ name: escritorio, user })
  // console.log('🚀 ~ file: escritorios.js:148 ~ testTemplates ~ existeEscritorio:', existeEscritorio.displayName)
  // const searchDesk = existeEscritorio.displayName
  // console.log('🚀 ~ file: escritorios.js:150 ~ testTemplates ~ searchDesk:', searchDesk)
  if (existeEscritorio === null) {
    console.log('No exite escritorio')
    // crear 404 y enviar
    res.status(404).send({ error: 'not found' })
    return
  }
  // const backgrounds = await getBackgrounds()
  // console.log(backgrounds)
  // try catch
  const columnas = await columnasModel.find({ user, escritorio }).sort({ order: 1 })
  console.log('🚀 ~ file: escritorios.js:160 ~ testTemplates ~ columnas:', columnas)
  const columnasAll = await columnasModel.find({ user }).sort({ order: 1 })
  const links = await linksModel.find({ user, escritorio }).sort({ orden: 1 })
  const mode = req.cookies.mode
  const locals = {
    escritorio,
    deskNames,
    columnas,
    columnasAll,
    links,
    user,
    userImg,
    mode
  }
  if (!req.cookies.mode || req.cookies.mode === 'normal') {
    res.setHeader('Cache-Control', 's-maxage=86400')
    res.render('indexTemplates.pug', locals)
  } else {
    res.setHeader('Cache-Control', 's-maxage=86400')
    res.status(200).render('indexTemplatesEdit.pug', locals)
  }
}
const getSidePanel = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400')
  res.status(200).render('includes/sidepanel.pug')
}
const ordenaDesks = async (req, res) => {
  try {
    const elementos = req.body.body
    console.log(elementos)
    const user = req.user.name

    // Creamos un mapa para almacenar el orden actual de los elementos
    const ordenActual = new Map()
    let orden = 0
    elementos.forEach((elemento) => {
      ordenActual.set(elemento, orden)
      orden++
    })
    console.log('🚀 ~ file: escritorios.js:196 ~ ordenaDesks ~ ordenActual:', ordenActual)

    // Actualizamos el campo "orden" de cada elemento en la base de datos
    const updates = elementos.map(async (elemento) => {
      const orden = ordenActual.get(elemento)
      await escritoriosModel.findOneAndUpdate(
        { displayName: elemento, user },
        { orden },
        { new: true }
      )
    })
    await Promise.all(updates)

    const data = await escritoriosModel.find({ user }).sort({ orden: 1 })
    // Enviamos la respuesta
    // res.status(200).json({ message: 'Elementos actualizados correctamente' });
    res.send(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar los elementos' })
  }
}
module.exports = { createDeskItem, getDeskItems, deleteDeskItem, editDeskItem, testTemplates, ordenaDesks, cagadasFix, getSidePanel }
