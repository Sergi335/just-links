const { handleHttpError } = require('../helpers/handleError')
const { tokenVerify } = require('../helpers/handleJwt')
const { usersModel } = require('../models/index')

const authMiddleware = async (req, res, next) => {
  try {
    // console.log(req)
    console.log('Cookies: ' + req.cookies.reactToken)
    console.log('Headers: ' + JSON.stringify(req.headers))

    if (!req.cookies.token) {
      if (req.headers.origin !== 'http://localhost:5173' || req.headers.origin !== 'http://localhost:5174') {
        console.log('Vale eres tu')
        const user = await usersModel.findOne({ name: 'SergioSR' })
        console.log('🚀 ~ file: session.js:17 ~ authMiddleware ~ user:', user)
        req.user = user
      } else {
        handleHttpError(res, 'NOT_TOKEN', 401)
        return
      }
    } else {
      const token = req.cookies.token
      // console.log(token)
      const dataToken = await tokenVerify(token)
      // console.log(dataToken)

      if (!dataToken._id) {
        handleHttpError(res, 'ERROR_ID_TOKEN', 401)
        return // Evitar que continúe ejecutando el código debajo
      }

      const user = await usersModel.findById(dataToken._id)
      req.user = user
    }

    next() // Llamar a next() una sola vez al final de la función
  } catch (e) {
    // handleHttpError(res, 'NOT_SESSION', 401)
    res.redirect('/')
  }
}

module.exports = { authMiddleware }
