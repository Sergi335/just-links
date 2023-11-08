const { getAuth } = require('firebase-admin/auth')
const admin = require('firebase-admin')
const serviceAccount = require('../../firebase-secret/justlinks-7330b-firebase-adminsdk-lxi21-31ef679de3.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const checkGoogleSession = (req, res) => {
  // idToken comes from the client app
  const { data } = req.body
  const idToken = data.idToken
  getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // const uid = decodedToken.uid
      res.send(data)
    })
    .catch((error) => {
      res.send({ error })
    })
}

module.exports = { checkGoogleSession }
