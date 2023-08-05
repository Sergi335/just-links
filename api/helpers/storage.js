const { initializeApp } = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } = require('firebase/storage')
const { firebaseConfig } = require('../config/firebase')
const { updateProfileImage } = require('../controllers/users')
const { setLinkImg, setImages, deleteImage } = require('../controllers/links')
const { escritoriosModel, columnasModel, linksModel } = require('../models/index')

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

const uploadProfileImage = async (req, res) => {
  // Asegurémonos de que 'file' está presente en la solicitud.
  if (!req.file) {
    res.status(400).send({ error: 'No se proporcionó ningún archivo' })
    return
  }

  const file = req.file
  const user = req.cookies.user
  const imagesRef = ref(storage, `${user}/images/profile`)

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.originalname.split('.').pop()
    const imageRef = ref(imagesRef, `${uniqueSuffix}.${extension}`)
    const snapshot = await uploadBytes(imageRef, file.buffer)
    // si el usuario ya tiene una habrá que borrar la antigua
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log(downloadURL)
    const resultadoDb = await updateProfileImage(downloadURL, user)
    console.log('🚀 ~ file: storage.js:30 ~ uploadProfileImage ~ resultadoDb:', resultadoDb)
    const firstKey = Object.keys(resultadoDb)[0]
    const firstValue = resultadoDb[firstKey]
    if (firstKey === 'error') {
      res.send({ error: `${firstKey} : ${firstValue}` })
    } else {
      res.send({ message: '¡Archivo o blob subido!' })
    }
  } catch (error) {
    console.error('Error al subir el archivo:', error)
    res.status(500).send({ error: 'Error al subir el archivo' })
  }
}
const uploadLinkIcon = async (req, res) => {
  const file = req.file
  const user = req.cookies.user
  const linkId = req.body.linkId
  const imagesRef = ref(storage, `${user}/images/icons`)
  // Si no hay imagen ha elegido una de muestra
  if (!req.file) {
    const filePath = req.body.filePath
    const resultadoDb = await setLinkImg(filePath, user, linkId)
    console.log(resultadoDb)
    const firstKey = Object.keys(resultadoDb)[0]
    const firstValue = resultadoDb[firstKey]
    if (firstKey === 'error') {
      res.send({ error: `${firstKey} : ${firstValue}` })
    } else {
      res.send({ message: '¡Ruta Cambiada!' })
    }
    return
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.originalname.split('.').pop()
    const imageRef = ref(imagesRef, `${uniqueSuffix}.${extension}`)
    try {
      const snapshot = await uploadBytes(imageRef, file.buffer)
      // si el usuario ya tiene una habrá que borrar la antigua
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log(downloadURL)
      console.log(req.body.linkId)
      const resultadoDb = await setLinkImg(downloadURL, user, linkId)
      const firstKey = Object.keys(resultadoDb)[0]
      const firstValue = resultadoDb[firstKey]
      if (firstKey === 'error') {
        res.send({ error: `${firstKey} : ${firstValue}` })
      } else {
        res.send({ message: '¡Archivo o blob subido!' })
      }
    } catch (error) {
      res.send(error)
    }
  } catch (error) {
    console.error('Error al subir el archivo:', error)
    res.status(500).send({ error: 'Error al subir el archivo' })
  }
}
const uploadImg = async (req, res) => {
  const file = req.file
  const user = req.cookies.user
  const linkId = req.body.linkId
  const imagesRef = ref(storage, `${user}/images/linkImages`)
  // Si no hay imagen error
  if (!req.file) {
    res.send({ error: 'No hemos recibido imagen' })
    return
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.originalname.split('.').pop()
    const imageRef = ref(imagesRef, `${uniqueSuffix}.${extension}`)
    try {
      const snapshot = await uploadBytes(imageRef, file.buffer)
      // si el usuario ya tiene una habrá que borrar la antigua
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log(downloadURL)
      console.log(req.body.linkId)
      const resultadoDb = await setImages(downloadURL, user, linkId)
      const firstKey = Object.keys(resultadoDb)[0]
      const firstValue = resultadoDb[firstKey]
      if (firstKey === 'error') {
        res.send({ error: `${firstKey} : ${firstValue}` })
      } else {
        res.send(resultadoDb)
      }
    } catch (error) {
      res.send(error)
    }
  } catch (error) {
    console.error('Error al subir el archivo:', error)
    res.status(500).send({ error: 'Error al subir el archivo' })
  }
}
const deleteImg = async (req, res) => {
  const user = req.cookies.user
  const linkId = req.body.id
  const imageUrl = req.body.image
  console.log(req.body)

  try {
    if (!imageUrl) {
      res.send({ error: 'No se encontró la imagen para eliminar' })
      return
    }

    // Construye la referencia a la imagen en Storage
    const imageRef = ref(storage, imageUrl)

    // Borra el archivo
    await deleteObject(imageRef)

    // Borra la referencia de la imagen en tu base de datos (suponiendo que tengas una función para hacerlo)
    await deleteImage(imageUrl, user, linkId)

    res.send({ message: 'Imagen eliminada exitosamente' })
  } catch (error) {
    console.error('Error al eliminar la imagen:', error)
    res.status(500).send({ error: 'Error al eliminar la imagen' })
  }
}
async function backup (req, res) {
  const user = req.user.name
  try {
    // Obtener la ruta completa del directorio de backups
    const fileName = `${user}dataBackup.json`
    const fileRef = ref(storage, `${user}/backups/${fileName}`)

    const data1 = await escritoriosModel.find({ user }).lean()
    const data2 = await columnasModel.find({ user }).lean()
    const data3 = await linksModel.find({ user }).lean()

    const backupData = {
      escritorios: data1,
      columnas: data2,
      links: data3
    }
    const jsonString = JSON.stringify(backupData)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const stream = await blob.arrayBuffer()
    const snapshot = await uploadBytes(fileRef, stream)

    const downloadUrl = await getDownloadURL(snapshot.ref)
    console.log('🚀 ~ file: storage.js:177 ~ backup ~ downloadUrl:', downloadUrl)

    console.log('Copia de seguridad almacenada en Firebase Storage correctamente.')
    const mensaje = 'Copia de seguridad creada'
    res.send({ mensaje })
  } catch (error) {
    const mensaje = 'Error al crear la copia de seguridad'
    console.error('Error al crear la copia de seguridad:', error)
    res.send({ mensaje })
  }
}
const downloadBackup = async (req, res) => {
  const user = req.user.name
  const fileName = `${user}dataBackup.json`
  const fileRef = ref(storage, `${user}/backups/${fileName}`)
  const downloadUrl = await getDownloadURL(fileRef)
  console.log(downloadUrl)

  res.send({ downloadUrl })
}
const getBackgrounds = async (user) => {
  try {
    const fileRef = ref(storage, `${user}/images/miniatures`)
    const list = await listAll(fileRef)
    const { items } = list
    // console.log(items)
    const backgroundsPromises = items.map(async (back) => ({
      url: await getDownloadURL(back),
      nombre: (await getMetadata(back)).name
    }))

    const backgrounds = await Promise.all(backgroundsPromises)
    return backgrounds
  } catch (err) {
    console.error('Error al leer la carpeta:', err)
    throw err
  }
}
const getBackgroundUrl = async (req, res) => {
  const user = req.user.name
  const nombre = req.query.nombre
  console.log('🚀 ~ file: storage.js:216 ~ getBackgroundUrl ~ user:', nombre)
  try {
    // const fileRef = ref(storage, `${user}/images/backgrounds`)
    // const list = await listAll(fileRef)
    // const { items } = list
    const fileRef = ref(storage, `${user}/images/backgrounds/${nombre}`)
    const downloadUrl = await getDownloadURL(fileRef)

    // const metadataPromises = items.map(async (item) => {
    //   const itemMetadata = await getMetadata(item)
    //   return itemMetadata
    // })

    // const metadata = await Promise.all(metadataPromises)

    // console.log('🚀 ~ file: storage.js:222 ~ getBackgroundUrl ~ metadata:', metadata)
    console.log('Me han llamado')
    res.send(downloadUrl)
  } catch (error) {
    res.send(error)
  }
}
module.exports = { uploadProfileImage, uploadLinkIcon, uploadImg, deleteImg, backup, downloadBackup, getBackgrounds, getBackgroundUrl }
