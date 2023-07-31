const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const tokenSign = async (user) => {
  console.log(user)
  console.log(`El id de usuario para la firma es ${user._id}`)
  const sign = jwt.sign(
    {
      _id: user._id,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: '72h'
    }

  )
  return sign
}
const tokenVerify = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET)
  } catch (e) {
    return null
  }
}

module.exports = { tokenSign, tokenVerify }
