const { initializeApp } = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { firebaseConfig } = require('../config/firebase')
const { updateProfileImage } = require('../controllers/users')
const { setLinkImg } = require('../controllers/links')

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

module.exports = { uploadProfileImage, uploadLinkIcon }
