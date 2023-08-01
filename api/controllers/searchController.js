const { linksModel } = require('../models/index')

const searchLinks = async (req, res) => {
  const query = req.query.query
  const user = req.user.name
  console.log(user)

  if (query.length < 2) {
    // Si la consulta tiene menos de tres letras, no se realiza la búsqueda
    return res.json([])
  }

  const regexQuery = new RegExp(`.*${query}.*`, 'i')

  linksModel.find({
    $or: [
      { name: regexQuery, user },
      { URL: regexQuery, user },
      { notes: regexQuery, user }
    ]
  })
    .then(results => {
      res.json(results)
    })
    .catch(error => {
      console.error('Error al buscar enlaces:', error)
      res.status(500).json({ error: 'Error al buscar enlaces' })
    })
}

module.exports = { searchLinks }
