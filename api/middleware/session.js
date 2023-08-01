const { handleHttpError } = require('../helpers/handleError')
const { tokenVerify } = require('../helpers/handleJwt')
const { usersModel } = require('../models/index')

const authMiddleware = async (req, res, next) => {
  try {
    console.log(req.cookies.token)
    if (!req.cookies.token) {
      handleHttpError(res, 'NOT_TOKEN', 401)
      return
    }
    const token = req.cookies.token
    console.log(token)
    const dataToken = await tokenVerify(token)
    console.log(dataToken)

    if (!dataToken._id) {
      handleHttpError(res, 'ERROR_ID_TOKEN', 401)
    }

    const user = await usersModel.findById(dataToken._id)
    req.user = user

    next()
  } catch (e) {
    handleHttpError(res, 'NOT_SESSION', 401)
  }
}

module.exports = { authMiddleware }
