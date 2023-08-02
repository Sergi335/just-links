const { initializeApp } = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { firebaseConfig } = require('../config/firebase')
const {udateProfileImage, updateProfileImage} = require('../controllers/users')

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
    const imageRef = ref(imagesRef, file.originalname)
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

module.exports = { uploadProfileImage }
