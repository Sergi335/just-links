const mongoose = require('mongoose')
const { columnasModel, linksModel } = require('../models/index')

/**
 * Funcion emergencia creada para actualizar la db con el campo orden de cada
 * columna en cada escritorio, no se usa.
 * @param {*} req
 * @param {*} res
 */
// eslint-disable-next-line no-unused-vars
const setOrder = async (req, res) => {
  try {
    const { body } = req

    // Obtener los paneles del escritorio
    const data = await columnasModel.find({ escritorio: body.escritorio })
    const paneles = [...new Set(data.map((element) => element.escritorio))]
    console.log(paneles)
    // Actualizar el campo "orden" para cada elemento del panel
    // eslint-disable-next-line no-unused-vars
    for (const panel of paneles) {
      const elementosPanel = await columnasModel
        .find({ escritorio: body.escritorio })
        .sort({ orden: 1 })
      console.log(elementosPanel)
      for (let i = 0; i < elementosPanel.length; i++) {
        await columnasModel.findByIdAndUpdate(
          elementosPanel[i]._id,
          { $set: { order: i } }
        )
      }
    }

    // Obtener la lista ordenada por el campo "orden"
    const lista = await columnasModel
      .find({ escritorio: body.escritorio }) // filtrar por panel tmb
      .sort({ orden: 1 })

    res.send(lista)
    // return lista;
  } catch (error) {
    console.error(error)
    res.status(500).send('Error interno del servidor')
  }
}
/**
 * Obtener lista de enlaces
 * @param {*} req
 * @param {*} res
 */
const getColItems = async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const params = req.query.escritorio
  const data = await columnasModel.find({ escritorio: `${params}` }).sort({ order: 1 })
  console.log(params)
  res.json(data)
}
const createColItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(body)
  // eslint-disable-next-line no-new-object
  const objeto = {}
  objeto.name = body.nombre
  objeto.escritorio = body.escritorio
  objeto.vacio = true
  objeto.order = body.orden
  objeto.user = user
  console.log(objeto)
  const data = await columnasModel.create(objeto)
  const lista = await columnasModel.find({ escritorio: `${body.escritorio}`, _id: data._id })
  res.send(lista)
}
const deleteColItem = async (req, res) => {
  console.time('myFunction')
  const { body } = req
  const user = req.user.name
  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    // Buscamos la columna que nos pasan por el body
    const column = await columnasModel.findOne({ _id: `${body.id}`, user }).session(session)
    // Borramos los links asociados a la columna
    await linksModel.deleteMany({ idpanel: `${body.id}`, user }).session(session)
    // Borramos la columna
    await columnasModel.deleteOne({ _id: `${body.id}`, user }).session(session)
    await session.commitTransaction()
    session.endSession()

    console.log(column.escritorio)

    // find by user y escritorio y pasar a ordenar
    res.send(column)
    const columnsLeft = await columnasModel.find({ escritorio: column.escritorio, user }).sort({ order: 1 })
    console.log('🚀 ~ file: columnas.js:116 ~ deleteColItem ~ columnsLeft:', columnsLeft)
    const columsLeftIds = columnsLeft.map(col => (
      col._id
    ))
    console.log('🚀 ~ file: columnas.js:120 ~ deleteColItem ~ columsLeftIds:', columsLeftIds)
    actualizarOrdenColumnasLocal(columsLeftIds, column.escritorio)
    console.timeEnd('myFunction')
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    res.send({ error: error.message })
    console.timeEnd('myFunction')
  }
}
const editColItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(body)
  try {
    const editedCol = await columnasModel.findOneAndUpdate(
      { _id: `${body.id}`, user }, // El filtro para buscar el documento
      { $set: { name: `${body.nombre}` } }
    )
    // Actualizamos los Links
    const filtroL = { idpanel: `${body.id}`, user } // Filtrar documentos
    const actualizacionL = { $set: { panel: `${body.nombre}` } } // Actualizar

    await linksModel.updateMany(filtroL, actualizacionL)
    // const lista = await columnasModel.find({ escritorio: `${body.escritorio}`, user })
    res.send(editedCol)
  } catch (error) {
    console.log(error) // Manejo de errores
    res.send(error)
  }
}
const moveColumns = async (req, res) => {
  const { body } = req
  console.log(body)
  const user = req.user.name
  const data = await columnasModel.find({ escritorio: body.deskDestino, user })

  await columnasModel.findOneAndUpdate(
    { _id: `${body.colId}` }, // El filtro para buscar el documento
    { $set: { escritorio: `${body.deskDestino}`, order: `${data.length + 1}` } }, // Las propiedades a actualizar
    { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
  )
  // Actualizamos los Links
  const filtroL = { user, idpanel: `${body.colId}` } // Filtrar documentos
  const actualizacionL = { $set: { escritorio: `${body.deskDestino}` } } // Actualizar

  await linksModel.updateMany(filtroL, actualizacionL)

  const response = {}
  response.length = data.length
  response.message = 'Movido correctamente'

  res.send({ response })
}
// Recibe las columnas que están actualmente en el escritorio por orden y recibe el escritorio donde están -> USER
const actualizarOrdenColumnas = async (req, res) => {
  try {
    const elementos = req.body.body
    const escritorio = req.query.escritorio
    console.log(elementos)
    console.log(escritorio)

    if (!escritorio) {
      return res.status(400).json({ message: 'Falta el parámetro "escritorio"' })
    }

    // Creamos un mapa para almacenar el orden actual de los elementos
    const ordenActual = new Map()
    let orden = 0
    elementos.forEach((elemento) => {
      ordenActual.set(elemento, orden)
      orden++
    })
    console.log(ordenActual)

    // Actualizamos el campo "orden" de cada elemento en la base de datos
    const updates = elementos.map(async (elemento) => {
      const orden = ordenActual.get(elemento)
      console.log(elemento)
      try {
        const updatedElement = await columnasModel.findOneAndUpdate(
          { _id: elemento, escritorio },
          { order: orden },
          { new: true }
        )

        if (!updatedElement) {
          console.warn(`No se encontró el elemento con _id=${elemento} y escritorio=${escritorio}`)
        }
      } catch (error) {
        console.error(`Error al actualizar el elemento con _id=${elemento} y escritorio=${escritorio}: ${error}`)
      }
    })
    await Promise.all(updates)

    // Enviamos la respuesta
    res.status(200).json({ message: 'Elementos actualizados correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar los elementos' })
  }
}
const actualizarOrdenColumnasLocal = async (elementos, escritorio) => {
  try {
    console.log(elementos)
    console.log(escritorio)

    if (!escritorio) {
      return { message: 'Falta el parámetro "escritorio"' }
    }

    // Creamos un mapa para almacenar el orden actual de los elementos
    const ordenActual = new Map()
    let orden = 0
    elementos.forEach((elemento) => {
      ordenActual.set(elemento, orden)
      orden++
    })
    console.log(ordenActual)

    // Actualizamos el campo "orden" de cada elemento en la base de datos
    const updates = elementos.map(async (elemento) => {
      const orden = ordenActual.get(elemento)
      console.log(elemento)
      try {
        const updatedElement = await columnasModel.findOneAndUpdate(
          { _id: elemento, escritorio },
          { order: orden },
          { new: true }
        )

        if (!updatedElement) {
          console.warn(`No se encontró el elemento con _id=${elemento} y escritorio=${escritorio}`)
        }
      } catch (error) {
        console.error(`Error al actualizar el elemento con _id=${elemento} y escritorio=${escritorio}: ${error}`)
      }
    })
    await Promise.all(updates)

    // Enviamos la respuesta
    return { message: 'Elementos actualizados correctamente' }
  } catch (error) {
    console.error(error)
    return { message: 'Error al actualizar los elementos' }
  }
}

module.exports = { createColItem, getColItems, deleteColItem, editColItem, actualizarOrdenColumnas, moveColumns }
