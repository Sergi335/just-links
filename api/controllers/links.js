const { linksModel, columnasModel } = require('../models/index')
const { handleHttpError } = require('../helpers/handleError')
const axios = require('axios')
const cheerio = require('cheerio')
const https = require('https')
const crypto = require('crypto')
const { URL } = require('url')

const getItem = async (req, res) => {
  const user = req.user.name
  const idLink = req.query.id
  const data = await linksModel.find({ _id: idLink, user })
  console.log(data)
  res.send({ data })
}
const getAllItems = async (req, res) => {
  const user = req.user.name
  const data = await linksModel.find({ user })
  console.log(data)
  res.send(data)
}
const setNotes = async (req, res) => {
  const { body } = req
  const user = req.user.name
  const idLink = body.id
  const data = await linksModel.findOneAndUpdate({ _id: idLink, user }, { $set: { notes: body.notes } })
  console.log(data)
  res.send({ data })
}
/**
 * Función para cambiar la imagen del link (favicon), si la url recibida es la de firebase inserta la ruta y si es de muestra inserta la ruta local
 * @param {*} url
 * @param {*} user
 * @param {*} linkId
 * @returns
 */
const setLinkImg = async (url, user, linkId) => {
  const urlObj = new URL(url)
  console.log('🚀 ~ file: links.js:39 ~ setLinkImg ~ urlObj:', urlObj)
  const dominio = 'firebasestorage.googleapis.com'
  const dominio2 = 't1.gstatic.com'
  if (urlObj.hostname === dominio || urlObj.hostname === dominio2) {
    try {
      const imagePath = url
      await linksModel.findOneAndUpdate({ _id: linkId, user }, { $set: { imgURL: imagePath } })
      return { message: 'imagen de link cambiada' }
    } catch (error) {
      return ({ error })
    }
  } else {
    try {
      const imagePath = urlObj.pathname
      await linksModel.findOneAndUpdate({ _id: linkId, user }, { $set: { imgURL: imagePath } })
      return { message: 'imagen de link cambiada' }
    } catch (error) {
      return ({ error })
    }
  }
}
const setImages = async (url, user, linkId) => {
  // const user = req.user.name
  // console.log(req.file)
  // Obtén la ruta del archivo subido desde multer
  if (url) {
    const imagePath = url
    const data = await linksModel.findOneAndUpdate(
      { _id: linkId, user },
      { $push: { images: imagePath } },
      { new: true }
    )
    console.log(data)
    return data
    // res.send(data)
    // res.send({ ok: 'Imagen subida y actualizada' })
  } else {
    return { error: 'No hay url' }
    // console.log(req.body.filePath)
    // res.send({ error: 'No hay filePath' })
  }
}
const deleteImage = async (url, user, linkId) => {
  console.log('🚀 ~ file: links.js:82 ~ deleteImage ~ url:', url)
  // let modifiedUrl = url.replace('http://localhost:3003/', '').split('/').join('\\')
  // modifiedUrl = modifiedUrl.replace('blob:', '')
  // console.log('🚀 ~ file: links.js:85 ~ deleteImage ~ modifiedUrl:', modifiedUrl)
  try {
    const updatedArticle = await linksModel.findOneAndUpdate(
      { _id: linkId, user },
      { $pull: { images: { $in: [url] } } },
      { new: true }
    )

    if (updatedArticle) {
      console.log('Artículo actualizado:', updatedArticle)
      // const filePath = path.join(__dirname, '../..', 'public', modifiedUrl)
      // console.log(filePath)
      // fs.unlink(filePath, (err) => {
      //   if (err) {
      //     console.error('Error al eliminar el archivo:', err)
      //     res.send({ error: 'Error al borrar' })
      //   } else {
      //     console.log('Archivo eliminado exitosamente.')
      //     res.send({ message: 'Borrado' })
      //   }
      // })
      // res.send({ message: 'Borrado' })
      return updatedArticle
    } else {
      console.log('No se encontró ningún artículo que cumpla los criterios de búsqueda.')
      return { error: 'No encontrado' }
    }
  } catch (error) {
    console.error('Error al actualizar el artículo:', error)
    return { error: 'Error al borrar' }
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
/**
 * Funcion emergencia creada para actualizar la db con el campo orden de cada
 * link en cada panel, no se usa.
 * @param {*} req
 * @param {*} res
 */
// eslint-disable-next-line no-unused-vars
const setOrder = async (req, res) => {
  try {
    const { body } = req

    // Obtener los paneles del escritorio
    const data = await linksModel.find({ escritorio: body.escritorio })
    const paneles = [...new Set(data.map((element) => element.panel))]

    // Actualizar el campo "orden" para cada elemento del panel
    for (const panel of paneles) {
      const elementosPanel = await linksModel
        .find({ escritorio: body.escritorio, panel })
        .sort({ orden: 1 })

      for (let i = 0; i < elementosPanel.length; i++) {
        await linksModel.findByIdAndUpdate(
          elementosPanel[i]._id,
          { $set: { orden: i } }
        )
      }
    }

    // Obtener la lista ordenada por el campo "orden"
    const lista = await linksModel
      .find({ escritorio: body.escritorio }) // filtrar por panel tmb
      .sort({ orden: 1 })

    // res.send(lista);
    return lista
  } catch (error) {
    console.error(error)
    res.status(500).send('Error interno del servidor')
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
 * Obtener lista de enlaces ordenados por el campo orden ascendente de un escritorio
 * pasado por la query, escritorio entero ojo rendimiento.
 * @param {*} req
 * @param {*} res
 */
const getItems = async (req, res) => {
  try {
    const user = req.user
    const params = req.query.escritorio
    const data = await linksModel.find({ escritorio: `${params}` }).sort({ orden: 1 })
    console.log(user)

    res.send(data)
  } catch (e) {
    console.log(e)
    handleHttpError(res, 'ERROR_RECOGIENDO_ITEMS')
  }
}
/**
 * Obtener enlace, no se usa pero está exportada
 * @param {*} req
 * @param {*} res
 */
const getItemsCount = async (req, res) => {
  const params = req.query.idpanel
  // const data = await linksModel.countDocuments({ idpanel: `${params}` });
  const data = await linksModel.find({ idpanel: `${params}` })

  res.send(String(data.length))
  // res.send('estas aqui')
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
 * Actualizar enlace al arrastrar entre columnas
 * @param {*} req
 * @param {*} res
 */
const editdragItem = async (req, res) => {
  const { body } = req
  // eslint-disable-next-line no-new-object
  const objeto = new Object()
  objeto.oldId = body.oldId
  objeto.newId = body.newId
  objeto.name = body.name
  objeto.escritorio = body.escritorio
  objeto.panel = body.panel
  console.log(objeto)
  // Si el elemento es arrastrado a una columna distinta
  if (objeto.oldId !== objeto.newId) {
    try {
      await linksModel.findOneAndUpdate(
        { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.oldId}` }, // El filtro para buscar el documento
        { $set: { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.newId}`, panel: `${objeto.panel}` } }, // La propiedad a actualizar
        { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
      )
      // Buscar en la old y new y si están vacias o no cambiar
      const count = await linksModel.find({ idpanel: objeto.oldId })
      if (count.length === 0) {
        console.log('Se queda vacia')
        await columnasModel.findOneAndUpdate({ _id: objeto.oldId }, { $set: { vacio: true } })
      } else {
        console.log('No se queda vacia')
        await columnasModel.findOneAndUpdate({ _id: objeto.oldId }, { $set: { vacio: false } })
      }
      await columnasModel.findOneAndUpdate({ _id: objeto.newId }, { $set: { vacio: false } })
    } catch (error) {
      console.log(error) // Manejo de errores
      res.send(error)
    }
    let lista = []
    lista = lista.concat(await setOrder2(objeto.escritorio, objeto.newId))
    lista = lista.concat(await setOrder2(objeto.escritorio, objeto.oldId))
    res.send(lista)
  } else {
    res.send({ Respuesta: 'Elemento arrastrado en la misma columna' })
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
/**
 * Edita enlace
 * @param {*} req
 * @param {*} res
 */
const editItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(user)
  console.log(body)

  try {
    const documentoActualizado = await linksModel.findOneAndUpdate(
      { _id: `${body.id}`, user }, // El filtro para buscar el documento
      { $set: { name: `${body.nombre}`, URL: `${body.URL}`, description: `${body.description}` } }, // La propiedad a actualizar
      { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
    )
    if (documentoActualizado !== null) {
      res.send(documentoActualizado)
      console.log(documentoActualizado)
    } else {
      res.send({ error: 'documento no encontrado' })
    }
  } catch (error) {
    console.log(error) // Manejo de errores
    res.send(error)
  }
}
const moveItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(body)
  if (body.escritorio !== undefined) {
    console.log('Se mueve a otro escritorio')
    await linksModel.findOneAndUpdate({ name: body.name, idpanel: body.panelOrigenId, user }, { $set: { idpanel: body.panelDestinoId, panel: body.panelDestinoNombre, orden: body.orden, escritorio: body.escritorio } })
    const link = await linksModel.find({ name: body.name, idpanel: body.panelDestinoId, user, escritorio: body.escritorio })
    const count = await linksModel.find({ idpanel: body.panelOrigenId, user })
    const countDest = await linksModel.find({ idpanel: body.panelDestinoId, user })
    if (count.length === 0) {
      console.log('Estaba vacia')
      await columnasModel.findOneAndUpdate({ _id: body.panelOrigenId }, { $set: { vacio: true } })
    } else {
      console.log('No se queda vacia')
    }
    if (countDest.length >= 1) {
      await columnasModel.findOneAndUpdate({ _id: body.panelDestinoId }, { $set: { vacio: false } })
    }
    res.send(link[0])
  } else {
    await linksModel.findOneAndUpdate({ name: body.name, idpanel: body.panelOrigenId, user }, { $set: { idpanel: body.panelDestinoId, panel: body.panelDestinoNombre, orden: body.orden } })
    const link = await linksModel.find({ name: body.name, idpanel: body.panelDestinoId, user })
    const count = await linksModel.find({ idpanel: body.panelOrigenId, user })
    const countDest = await linksModel.find({ idpanel: body.panelDestinoId, user })
    console.log('🚀 ~ file: links.js:409 ~ moveItem ~ countDest:', countDest)
    if (count.length === 0) {
      console.log('Estaba vacia')
      await columnasModel.findOneAndUpdate({ _id: body.panelOrigenId }, { $set: { vacio: true } })
    } else {
      console.log('No se queda vacia')
    }
    if (countDest.length >= 1) {
      await columnasModel.findOneAndUpdate({ _id: body.panelDestinoId }, { $set: { vacio: false } })
    }
    res.send(link[0])
  }
}
/**
 * Función para actualizar orden de links dentro del mismo panel
 * @param {*} req
 * @param {*} res
 */
const actualizarOrdenElementos = async (req, res) => {
  try {
    const elementos = req.body.body
    console.log(elementos)
    const idColumna = req.query.idColumna

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
      await linksModel.findOneAndUpdate(
        { name: elemento, idpanel: idColumna },
        { orden },
        { new: true }
      )
    })
    await Promise.all(updates)

    const data = await linksModel.find({ idpanel: `${idColumna}` }).sort({ orden: 1 })
    // Enviamos la respuesta
    // res.status(200).json({ message: 'Elementos actualizados correctamente' });
    res.send(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar los elementos' })
  }
}
const obtenerStatus = async (req, res) => {
  const url = req.query.url
  // console.log('🚀 ~ file: links.js:455 ~ obtenerStatus ~ url:', url)
  const agentOptions = {
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
  }
  const agent = new https.Agent(agentOptions)
  try {
    // Realizar la solicitud HTTP con Axios
    const response = await axios.get(url, { httpsAgent: agent })
    // console.log('🚀 ~ file: links.js:465 ~ obtenerStatus ~ response:', response)
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
    // console.log('🚀 ~ file: links.js:484 ~ obtenerStatus ~ error:', error)
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
module.exports = { getItemsCount, getItems, createItem, deleteItem, editItem, editdragItem, actualizarOrdenElementos, getNameByUrl, moveItem, getItem, setNotes, setLinkImg, setImages, deleteImage, obtenerStatus, encontrarDuplicadosPorURL, getAllItems, createMultipleItems }
