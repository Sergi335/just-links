const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()
// eslint-disable-next-line no-unused-vars
const { registraUsuario, compruebaUsuario, eliminaUsuario, cambiaPassword, compruebaUsuarioUniversal } = require('../controllers/auth')

const { deleteLinks, getNameByUrl, obtenerStatus, encontrarDuplicadosPorURL, getLinks, editLinks, createLinks } = require('../controllers/links')
// eslint-disable-next-line no-unused-vars
const { getDeskItems, deleteDeskItem, createDeskItem, editDeskItem, testTemplates, ordenaDesks, cagadasFix, getSidePanel } = require('../controllers/escritorios')

const { authMiddleware } = require('../middleware/session')

// eslint-disable-next-line no-unused-vars
const { validateCreateLink, validateEditLink } = require('../validators/links')

// eslint-disable-next-line no-unused-vars
const { validateEditColumn, validateCreateColumn } = require('../validators/columnas')
// eslint-disable-next-line no-unused-vars
const { validateEditDesktop, validateCreateDesktop } = require('../validators/escritorios')

const { getColItems, createColItem, deleteColItem, editColItem, actualizarOrdenColumnas, moveColumns, getAllColItems } = require('../controllers/columnas')

const { displayUserProfile, editAditionalInfo } = require('../controllers/users')

const { searchLinks } = require('../controllers/searchController')

const { uploadProfileImage, uploadLinkIcon, uploadImg, deleteImg, backup, downloadBackup, getBackgroundUrl, deleteLinkImg, getBackgroundsPublic } = require('../helpers/storage')

// const { getArticle } = require('../controllers/articles.mjs')
const { checkGoogleSession } = require('../helpers/googleAuth')
router.get('/', (req, res) => {
  res.render('landing.pug')
})

// router.get('/api/article', getArticle)

router.get('/api/links/:operation/:value', getLinks)
router.patch('/api/links', authMiddleware, editLinks)
router.post('/api/links', authMiddleware, createLinks)
router.delete('/api/links', authMiddleware, deleteLinks)

router.post('/login', compruebaUsuario)

router.post('/session', checkGoogleSession)

// router.get('/api/cagadas', cagadasFix)
router.get('/desktop/:nombre', authMiddleware, testTemplates)
router.get('/profile', authMiddleware, displayUserProfile)

router.get('/api/linkStatus', authMiddleware, obtenerStatus) // /helpers/ ...
router.get('/api/duplicados', authMiddleware, encontrarDuplicadosPorURL) // /helpers/ ...
router.get('/api/linkName', getNameByUrl) // /helpers/ ...
router.get('/api/columnasAll', getAllColItems)
router.get('/api/columnas', getColItems)
router.get('/api/escritorios', authMiddleware, getDeskItems)
router.get('/api/escritorios/backgrounds', authMiddleware, getBackgroundsPublic)
router.get('/api/sidepanel', authMiddleware, getSidePanel)
router.get('/api/search', authMiddleware, searchLinks)
router.get('/api/deleteUser', authMiddleware, eliminaUsuario)
router.get('/api/downloadBackup', authMiddleware, downloadBackup)
router.get('/api/getBackground', authMiddleware, getBackgroundUrl)

router.post('/api/changePassword', authMiddleware, cambiaPassword)
// router.post('/register', registraUsuario)
router.post('/api/columnas', authMiddleware, createColItem)
router.post('/api/escritorios', authMiddleware, createDeskItem)
router.post('/api/backup', authMiddleware, backup)
router.post('/api/uploadImgProfile', authMiddleware, upload.single('file'), uploadProfileImage)
router.post('/api/uploadLinkImg', authMiddleware, upload.single('linkImg'), uploadLinkIcon)
router.post('/api/uploadImg', authMiddleware, upload.single('images'), uploadImg)
router.post('/api/userAditionalInfo', authMiddleware, editAditionalInfo)
router.delete('/api/deleteImg', authMiddleware, deleteImg)
router.delete('/api/columnas', authMiddleware, deleteColItem)
router.delete('/api/escritorios', authMiddleware, deleteDeskItem)
router.delete('/api/deleteLinkImg', authMiddleware, deleteLinkImg)
router.put('/api/columnas', authMiddleware, editColItem)
router.put('/api/escritorios', authMiddleware, editDeskItem)
router.put('/api/dragcol', actualizarOrdenColumnas)
router.put('/api/ordenaDesks', authMiddleware, ordenaDesks)
router.put('/api/moveCols', authMiddleware, moveColumns)

module.exports = router
