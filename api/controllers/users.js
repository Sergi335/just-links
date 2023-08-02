const { escritoriosModel, usersModel } = require('../models/index')
// eslint-disable-next-line no-unused-vars
const { linksModel } = require('../models/index')
// eslint-disable-next-line no-unused-vars
const { columnasModel } = require('../models/index')

const displayUserProfile = async (req, res) => {
  try {
    const user = req.user.name
    const userData = await usersModel.find({ name: user })
    const userImg = userData[0].profileImage
    console.log(userImg)
    console.log(userData)
    const escritorios = await escritoriosModel.find({ user }).sort({ orden: 1 })
    const escritoriosCount = escritorios.length
    const panelesCount = await (await columnasModel.find({ user })).length
    const linksCount = await (await linksModel.find({ user })).length
    console.log(panelesCount)
    const fecha = new Date(userData[0].createdAt)
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
    const formatoFecha = fecha.toLocaleDateString('es-ES', opciones)
    // const formatoHora = fecha.toLocaleTimeString('es-ES')
    const formatoFinal = `${formatoFecha}`

    const locals = {
      user,
      escritorios,
      userImg,
      userData,
      formatoFinal,
      escritoriosCount,
      panelesCount,
      linksCount
    }
    res.render('profile.pug', locals)
  } catch (error) {
    res.send({ error })
  }
}
const updateProfileImage = async (url, user) => {
  const imagePath = url
  // const newPath = imagePath.replace(/^public\\/, '')
  // console.log(newPath)
  // console.log(user)
  // Realiza la actualización en la base de datos
  usersModel.findOneAndUpdate(
    { name: user },
    { profileImage: imagePath },
    { new: true }
  )
    .then(user => {
      if (user) {
        // Usuario encontrado y actualizado correctamente
        console.log('Usuario encontrado y actualizado:', user)
        const mensaje = 'Usuario encontrado y actualizado'
        // res.send({ mensaje })
        console.log(mensaje)
        // Continúa con el flujo de tu aplicación
      } else {
        // No se encontró el usuario
        console.log('Usuario no encontrado')
        // Maneja el caso de usuario no encontrado de alguna manera apropiada
      }
    })
    .catch(error => {
      console.error('Error al buscar y actualizar el usuario:', error)
      // Maneja el error de alguna manera apropiada
    })
}

module.exports = { displayUserProfile, updateProfileImage }
