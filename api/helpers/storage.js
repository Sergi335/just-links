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
    updateProfileImage(downloadURL, user)
    res.send({ message: '¡Archivo o blob subido!' })
  } catch (error) {
    console.error('Error al subir el archivo:', error)
    res.status(500).send({ error: 'Error al subir el archivo' })
  }
}
const uploadLinkIcon = async (req, res) => {
  const file = req.file
  const user = req.cookies.user
  const imagesRef = ref(storage, `${user}/images/icons`)
  const linkId = req.body.linkId
  // Asegurémonos de que 'file' está presente en la solicitud.
  if (!req.file) {
    const filePath = req.body.filePath
    setLinkImg(filePath, user, linkId)
    console.log(req.body.filePath)
    res.send({ message: '¡Ruta Cambiada!' })
    return
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.originalname.split('.').pop()
    const imageRef = ref(imagesRef, `${uniqueSuffix}.${extension}`)
    const snapshot = await uploadBytes(imageRef, file.buffer)
    // si el usuario ya tiene una habrá que borrar la antigua
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log(downloadURL)
    console.log(req.body.linkId)
    setLinkImg(downloadURL, user, linkId)
    res.send({ message: '¡Archivo o blob subido!' })
  } catch (error) {
    console.error('Error al subir el archivo:', error)
    res.status(500).send({ error: 'Error al subir el archivo' })
  }
}

module.exports = { uploadProfileImage, uploadLinkIcon }
