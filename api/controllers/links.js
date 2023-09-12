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
  console.log(req.cookies)
  const user = 'SergioSR'
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
        res.status(200).json(data)
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
  console.log(body)
  const { fields } = body
  const { idpanel } = fields
  const user = req.user.name
  console.log('🚀 ~ file: links.js:53 ~ editLinks ~ user:', user)
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
        setLinksOrder(body.destinyIds, idpanel)
        setLinksOrder(body.originIds, body.idpanelOrigen)
      } else {
        // Si es movido a la misma
        checkEmptyColumn(user, idpanel, body.idpanelOrigen)
        setLinksOrder(body.destinyIds, idpanel)
      }
    } catch (error) {
      res.status(500).send({ error })
    }
  } else {
    res.status(500).send('Not Id')
  }
  console.log(body)
}
const createLinks = async (req, res) => {
  console.log(req.body)
  const user = req.user.name
  const links = req.body.data
  const { idpanel } = req.body
  if (Array.isArray(links) && links.length > 0) {
    try {
      if (links.length === 1) {
        const count = await linksModel.countDocuments({ idpanel, user })
        console.log('🚀 ~ file: links.js:87 ~ testCreateLink ~ count:', count)
        if (count === 0) {
          await columnasModel.findOneAndUpdate({ _id: idpanel, user }, { $set: { vacio: false } })
        }
        if (links[0].name === undefined) {
          const name = await getNameByUrlLocal(links[0].URL)
          const data = await linksModel.create({ user, ...links[0], name, orden: count + 1 })
          res.status(201).send(data)
        } else {
          const data = await linksModel.create({ user, ...links[0], orden: count + 1 })
          res.status(201).send(data)
        }
      } else {
        const count = await linksModel.countDocuments({ idpanel, user })
        console.log('Multiple')
        if (count === 0) {
          await columnasModel.findOneAndUpdate({ _id: idpanel, user }, { $set: { vacio: false } })
        }
        const data = []
        for (const link of links) {
          const name = await getNameByUrlLocal(link.URL)
          data.push(await linksModel.create({ user, ...link, name, orden: count + 1 }))
        }
        res.status(201).send(data)
      }
      const results = await linksModel.find({ idpanel, user }).select('id').lean()
      console.log(results)
      const ids = results.map(res => (
        res._id
      ))
      console.log(ids)
      setLinksOrder(ids, idpanel)
    } catch (error) {
      res.status(500).send({ error })
    }
  } else {
    res.status(500).send({ error: 'El parámetro debe ser un array' })
  }
}
/**
 * Borra enlace
 * @param {*} req
 * @param {*} res
 */
const deleteLinks = async (req, res) => {
  const { body } = req
  const { idpanel } = body
  const user = req.user.name
  console.log(body)
  try {
    await linksModel.deleteOne({ _id: `${body.linkId}`, user })
    // Find y contar si 0 cambiar vacio true
    const count = await linksModel.countDocuments({ idpanel, user })
    if (count === 0) {
      console.log('Esta vacia')
      await columnasModel.findOneAndUpdate({ _id: idpanel, user }, { $set: { vacio: true } })
    } else {
      console.log('No esta vacia')
    }
    // buscar por id los links y mandar a helper
    const lista = await linksModel.find({ idpanel, user })
    res.status(200).send(lista)
    const results = await linksModel.find({ idpanel, user }).select('id').lean()
    console.log(results)
    const ids = results.map(res => (
      res._id
    ))
    console.log(ids)
    setLinksOrder(ids, idpanel)
  } catch (error) {
    res.status(500).send({ error })
  }
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
module.exports = { deleteLinks, getNameByUrl, obtenerStatus, encontrarDuplicadosPorURL, getLinks, editLinks, createLinks }
