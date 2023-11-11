const { getAuth } = require('firebase-admin/auth')
const admin = require('firebase-admin')
// const serviceAccount = require('../../firebase-secret/justlinks-7330b-firebase-adminsdk-lxi21-d04809bcea.json')

const serviceAccount = {
  type: process.env.FBADMIN_TYPE,
  project_id: process.env.FBADMIN_PROJECT_ID.toString(),
  private_key_id: process.env.FBADMIN_PRIVATE_KEY_ID.toString(),
  private_key: process.env.FBADMIN_PRIVATE_KEY.toString(),
  client_email: process.env.FBADMIN_CLIENT_EMAIL.toString(),
  client_id: process.env.FBADMIN_CLIENT_ID.toString(),
  auth_uri: process.env.FBADMIN_AUTH_URI.toString(),
  token_uri: process.env.FBADMIN_TOKEN_URI.toString(),
  auth_provider_x509_cert_url: process.env.FBADMIN_AUTH_PROV_509.toString(),
  client_x509_cert_url: process.env.FBADMIN_CLIENT_509.toString(),
  universe_domain: process.env.FBADMIN_UNIVERSE_DOM.toString()
}
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
