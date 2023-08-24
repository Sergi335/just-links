const { linksModel, columnasModel } = require('../models/index')
const { checkEmptyColumn } = require('../helpers/checkEmptyColumn')
const { setLinksOrder } = require('../helpers/setLinksOrder')
// const { handleHttpError } = require('../helpers/handleError')
const axios = require('axios')
const cheerio = require('cheerio')
const https = require('https')
const crypto = require('crypto')
const { URL } = require('url')

const getLinks = async (req, res) => {
  const OPERATIONS_AVAILABLE = ['id', 'all', 'count', 'desktop']
  const operation = req.params.operation
  const user = req.user.name
  if (OPERATIONS_AVAILABLE.includes(operation) && user) {
    console.log(req.params)
    console.log(operation)
    try {
      if (operation === 'id') {
        const id = req.params.value
        const data = await linksModel.findById({ _id: id, user })
        res.status(200).send(data)
      }
      if (operation === 'desktop') {
        const desktop = req.params.value
        const data = await linksModel.find({ escritorio: desktop, user })
        res.status(200).send(data)
      }
      if (operation === 'all') {
        const data = await linksModel.find({ user })
        res.status(200).send(data)
      }
      if (operation === 'count') {
        const data = await linksModel.countDocuments({ user })
        res.status(200).send({ data })
      }
    } catch (error) {
      res.status(500).send({ error })
    }
  } else {
    console.log(req.params)
    console.log(operation)
    res.status(401).send('Not Allowed')
  }
}
const editLinks = async (req, res) => {
  const { body } = req
  const { fields } = body
  const { idpanel } = fields
  const user = req.user.name
  if (body.id && user) {
    try {
      // Solo hay que pasar los datos que se van a cambiar
      const data = await linksModel.findOneAndUpdate({ _id: body.id, user }, { $set: { ...fields } }, { new: true })
      console.log(data)
      res.status(200).send(data)
      // Sección por si el elemento es movido/arrastrado a otra columna o a la misma
      if (body.idpanelOrigen) {
        // Si es movido a otra columna
        checkEmptyColumn(user, idpanel, body.idpanelOrigen)
        setLinksOrder(body.destinyNames, idpanel)
        setLinksOrder(body.originNames, body.idpanelOrigen)
      } else {
        // Si es movido a la misma
        checkEmptyColumn(user, idpanel, body.idpanelOrigen)
        setLinksOrder(body.destinyNames, idpanel)
      }
    } catch (error) {
      res.status(500).send({ error })
    }
  } else {
    res.status(500).send('Not Id')
  }
  console.log(body)
}
const getNameByUrl = async (req, res) => {
  const url = req.query.url
  axios.get(url)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const title = $('title').text()
      console.log('El título de la página es: ' + title)
      res.send(title)
    })
    .catch(error => {
      console.log('Hubo un error al obtener el título de la página:', error)
    })
}
const getNameByUrlLocal = async (url) => {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)
    const title = $('title').text()
    console.log('El título de la página es: ' + title)
    return title
  } catch (error) {
    const altTitle = new URL(url).host
    console.log('Hubo un error al obtener el título de la página:', error)
    return altTitle // Lanzar el error para manejarlo en la función llamante
  }
}
/**
* Funcion para ordenar los links de un escritorio y un panel pasados como parametro según su campo * orden, es llamada por: editDragItem, deleteItem
* @param {*} req
* @param {*} res
*/
const setOrder2 = async (desk, panel) => {
  try {
    console.log(desk, panel)

    // Actualizar el campo "orden" para cada elemento del panel
    const elementosPanel = await linksModel
      .find({ escritorio: desk, idpanel: panel })
      .sort({ orden: 1 })

    for (let i = 0; i < elementosPanel.length; i++) {
      await linksModel.findByIdAndUpdate(
        elementosPanel[i]._id,
        { $set: { orden: i } }
      )
    }
    // Obtener la lista ordenada por el campo "orden"
    const lista = await linksModel
      .find({ escritorio: desk, idpanel: panel })
      .sort({ orden: 1 })

    // console.log(`La lista es: ${lista}`);
    return lista
  } catch (error) {
    console.error(error)
    return error
  }
}
/**
 * Crear enlace nuevo
 * @param {*} req
 * @param {*} res
 */
const createItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  const objeto = { ...body, user }
  if (body.nombre === undefined) {
    console.log('Hay que consultar el nombre')
  }

  // Find idpanel si estaba vacio cambiar flag a false
  const count = await linksModel.find({ idpanel: objeto.idpanel, user })
  if (count.length === 0) {
    console.log('Estaba vacia')
    await columnasModel.findOneAndUpdate({ _id: objeto.idpanel, user }, { $set: { vacio: false } })
  } else {
    console.log('No estaba vacia')
  }
  const data = await linksModel.create(objeto)
  res.send(data)
  // Obtener los paneles del escritorio
  const data2 = await linksModel.find({ escritorio: body.escritorio, panel: body.columna })
  const paneles = [...new Set(data2.map((element) => element.panel))]

  // Actualizar el campo "orden" para cada elemento del panel, se podría llamar a setOrder2?
  for (const panel of paneles) {
    const elementosPanel = await linksModel
      .find({ escritorio: body.escritorio, panel, user })
      .sort({ orden: 1 })

    for (let i = 0; i < elementosPanel.length; i++) {
      await linksModel.findByIdAndUpdate(
        elementosPanel[i]._id,
        { $set: { orden: i } }
      )
    }
  }
}
const createMultipleItems = async (req, res) => {
  const { body } = req
  const user = req.user.name
  const links = body.data
  const count = await linksModel.find({ idpanel: body.idpanel, user })

  if (count.length === 0) {
    console.log('Estaba vacia')
    await columnasModel.findOneAndUpdate({ _id: body.idpanel, user }, { $set: { vacio: false } })
  } else {
    console.log('No estaba vacia')
  }

  if (Array.isArray(body.data)) {
    try {
      console.log(body.data)
      let counter = 0

      for (const link of links) {
        const name = await getNameByUrlLocal(link)
        const object = {
          name,
          user,
          URL: link,
          imgURL: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link}&size=64`,
          escritorio: body.escritorio,
          panel: body.panel,
          idpanel: body.idpanel,
          orden: count.length + counter
        }
        counter++
        console.log(object)
        await linksModel.create(object)
      }
      const data = await linksModel.find({ idpanel: body.idpanel, user })
      res.send(data)
      setOrder2(body.escritorio, body.idpanel)
    } catch (error) {
      res.send({ error: error.message })
    }
  }
}
/**
 * Borra enlace
 * @param {*} req
 * @param {*} res
 */
const deleteItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(body)
  await linksModel.deleteOne({ _id: `${body.linkId}`, user })
  // Find y contar si 0 cambiar vacio true
  const count = await linksModel.find({ idpanel: body.id, user })
  if (count.length === 0) {
    console.log('Esta vacia')
    await columnasModel.findOneAndUpdate({ _id: body.id, user }, { $set: { vacio: true } })
  } else {
    console.log('No esta vacia')
  }
  const lista = await setOrder2(body.escritorio, body.id)
  res.send(lista)
}
// Mucha función para tan poca fiabilidad, hay que pulirlo esto
const obtenerStatus = async (req, res) => {
  const url = req.query.url
  const agentOptions = {
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
  }
  const agent = new https.Agent(agentOptions)
  try {
    // Realizar la solicitud HTTP con Axios
    const response = await axios.get(url, { httpsAgent: agent })
    // const response = await fetch(url, { mode: 'no-cors' })
    const statusCode = response.status

    let status
    if (statusCode >= 100 && statusCode <= 199) {
      status = 'informational'
    } else if (statusCode >= 200 && statusCode <= 299) {
      status = 'success'
    } else if (statusCode >= 300 && statusCode <= 399) {
      status = 'redirect'
    } else if (statusCode >= 400 && statusCode <= 499) {
      status = 'clientErr'
    } else if (statusCode >= 500 && statusCode <= 599) {
      status = 'serverErr'
    }

    res.send({ status })
  } catch (error) {
    if (error.response) {
      // Error de respuesta HTTP con un código de estado
      const statusCode = error.response.status
      let status

      if (statusCode >= 100 && statusCode <= 199) {
        status = 'informational'
      } else if (statusCode >= 200 && statusCode <= 299) {
        status = 'success'
      } else if (statusCode >= 300 && statusCode <= 399) {
        status = 'redirect'
      } else if (statusCode >= 400 && statusCode <= 499) {
        status = 'clientErr'
      } else if (statusCode >= 500 && statusCode <= 599) {
        status = 'serverErr'
      }
      if (statusCode === 403) {
        status = 'success'
      }
      res.send({ status })
    } else {
      // Otro tipo de error
      console.error('Error:', error)
      res.send({ error: 'Fallo al obtener datos' })
    }
  }
}
const encontrarDuplicadosPorURL = async (req, res) => {
  const user = req.user.name
  try {
    const duplicados = await linksModel.aggregate([
      { $match: { user } }, // Filtrar por el usuario específico
      { $group: { _id: '$URL', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ])
    const search = await Promise.all(
      duplicados.map(async (link) => {
        try {
          const objeto = await linksModel.find({ URL: link._id, user })
          return objeto
        } catch (error) {
          console.error('Error en la búsqueda:', error)
        }
      })
    )
    const flattenedData = search.flatMap(group => group)
    res.send(flattenedData)
  } catch (error) {
    console.error('Error en la consulta:', error)
    res.send({ error })
  }
}
module.exports = { createItem, deleteItem, getNameByUrl, obtenerStatus, encontrarDuplicadosPorURL, createMultipleItems, getLinks, editLinks }
