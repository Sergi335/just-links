const { escritoriosModel, usersModel } = require('../models/index')
const { linksModel } = require('../models/index')
const { columnasModel } = require('../models/index')
const { createDummyContent } = require('../helpers/createDummyContent')

const cagadasFix = async (req, res) => {
  try {
    // Actualizamos las columnas
    const filtro = { escritorio: '&lt;h1&gt;Hola&lt;&#x2F;h1&gt;', user: 'SergioSR' } // Filtrar documentos
    console.log(filtro)
    const actualizacion = { $set: { escritorio: 'Test' } } // Actualizar
    console.log(actualizacion)

    await columnasModel.updateMany(filtro, actualizacion)

    // Actualizamos los Links
    const filtroL = { escritorio: '&lt;h1&gt;Hola&lt;&#x2F;h1&gt;', user: 'SergioSR' } // Filtrar documentos
    const actualizacionL = { $set: { escritorio: 'Test' } } // Actualizar

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
  const { body } = req
  console.log(body)
  const user = req.user.name
  const seek = await escritoriosModel.find({ name: `${body.nombre}`, user: `${user}` })
  const err = { error: 'El escritorio ya existe' }
  if (seek.length > 0) {
    res.send(err)
  } else {
    try {
      await escritoriosModel.findOneAndUpdate(
        { name: `${body.nombreOld}`, user: `${user}` }, // El filtro para buscar el documento
        { $set: { name: `${body.nombre}` } }, // La propiedad a actualizar
        { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
      )
      // Actualizamos las columnas
      const filtro = { escritorio: `${body.nombreOld}`, user: `${user}` } // Filtrar documentos
      console.log(filtro)
      const actualizacion = { $set: { escritorio: `${body.nombre}` } } // Actualizar
      console.log(actualizacion)

      await columnasModel.updateMany(filtro, actualizacion)

      // Actualizamos los Links
      const filtroL = { escritorio: `${body.nombreOld}`, user: `${user}` } // Filtrar documentos
      const actualizacionL = { $set: { escritorio: `${body.nombre}` } } // Actualizar

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
  const { body } = req
  console.log(body)

  const objeto = {}
  objeto.name = body.nombre
  objeto.user = req.user.name
  objeto.orden = body.orden
  console.log(objeto)
  const seek = await escritoriosModel.find({ name: `${objeto.name}`, user: `${objeto.user}` })
  const err = { error: 'El escritorio ya existe' }
  if (seek.length > 0) {
    res.send(err)
  } else {
    await escritoriosModel.create(objeto)
    const lista = await escritoriosModel.find({ user: `${objeto.user}` }).sort({ orden: 1 })
    res.send(lista)
  }
}
/**
 * Borra escritorio
 * @param {*} req
 * @param {*} res
 */
const deleteDeskItem = async (req, res) => {
  const { body } = req
  console.log(body)
  const user = req.user.name
  const linksinDesk = await linksModel.deleteMany({ escritorio: `${body.name}`, user })
  const panelsinDesk = await columnasModel.deleteMany({ escritorio: `${body.name}`, user })
  const data = await escritoriosModel.deleteOne({ name: `${body.name}`, user })
  const lista = await escritoriosModel.find().sort({ orden: 1 })
  console.log(data)
  console.log(linksinDesk)
  console.log(panelsinDesk)
  res.send(lista)
}
const testTemplates = async (req, res) => {
  console.log(req.query.mode)
  const params = req.query.escritorio
  console.log('🚀 ~ file: escritorios.js:124 ~ testTemplates ~ params:', params)
  const user = req.cookies.user
  // User new? if si crear dummy content
  let isNewUser = await usersModel.find({ name: `${user}` })
  const userImg = isNewUser[0].profileImage
  isNewUser = isNewUser[0].newUser
  console.log(`Es nuevo usuario? ${isNewUser}`)
  if (isNewUser) {
    // Insertar en DB
    await createDummyContent(user)
  }
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
    userImg,
    mode
  }
  if (!req.cookies.mode || req.cookies.mode === 'normal') {
    res.render('indexTemplates.pug', locals)
  } else {
    res.render('indexTemplatesEdit.pug', locals)
  }
}
const getSidePanel = async (req, res) => {
  res.render('includes/sidepanel.pug')
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

    // Actualizamos el campo "orden" de cada elemento en la base de datos
    const updates = elementos.map(async (elemento) => {
      const orden = ordenActual.get(elemento)
      await escritoriosModel.findOneAndUpdate(
        { name: elemento, user },
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
