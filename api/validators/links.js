const { check } = require('express-validator')
const { validateResults } = require('../helpers/handleValidators')

const validateEditLink = [
  check('name')
    .exists()
    .notEmpty()
    .isLength({ min: 1, max: 235 }),
  check('URL')
    .exists()
    .notEmpty()
    .isURL({
      // host_whitelist: ['localhost']
    }),
  (req, res, next) => {
    return validateResults(req, res, next)
  }
]
const validateCreateLink = [
  check('name')
    .exists()
    .notEmpty()
    .isLength({ min: 1, max: 235 }),
  check('URL')
    .exists()
    .notEmpty()
    .isURL({
      // host_whitelist: ['localhost']
    }),
  (req, res, next) => {
    return validateResults(req, res, next)
  }
]

module.exports = { validateEditLink, validateCreateLink }
