const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()
const { registraUsuario, compruebaUsuario, eliminaUsuario, cambiaPassword } = require('../controllers/auth')
const { getItems, getItemsCount, createItem, deleteItem, editItem, editdragItem, actualizarOrdenElementos, getNameByUrl, moveItem, getItem, setNotes, setImages, deleteImage, obtenerStatus, encontrarDuplicadosPorURL, getAllItems } = require('../controllers/links')
const { getDeskItems, deleteDeskItem, createDeskItem, editDeskItem, testTemplates, ordenaDesks, cagadasFix, getSidePanel } = require('../controllers/escritorios')
const { authMiddleware } = require('../middleware/session')
const { validateCreateLink, validateEditLink } = require('../validators/links')
const { validateEditColumn, validateCreateColumn } = require('../validators/columnas')
const { validateEditDesktop, validateCreateDesktop } = require('../validators/escritorios')
const { getColItems, createColItem, deleteColItem, editColItem, actualizarOrdenColumnas, moveColumns } = require('../controllers/columnas')
const { displayUserProfile } = require('../controllers/users')
const { searchLinks } = require('../controllers/searchController')
const { uploadProfileImage, uploadLinkIcon } = require('../helpers/storage')

router.get('/', (req, res) => {
  res.render('landing.pug')
})

router.get('/cagadas', cagadasFix)

router.get('/linkStatus', authMiddleware, obtenerStatus)
router.get('/columnas', getColItems)
router.get('/link', authMiddleware, getItem)
router.get('/links', authMiddleware, getItems)
router.get('/allLinks', authMiddleware, getAllItems)
router.get('/templates', authMiddleware, testTemplates)
router.get('/duplicados', authMiddleware, encontrarDuplicadosPorURL)
router.get('/linksCount', getItemsCount)
router.get('/linkName', authMiddleware, getNameByUrl)
router.get('/escritorios', getDeskItems)
router.get('/sidepanel', authMiddleware, getSidePanel)
router.get('/search', authMiddleware, searchLinks)
router.get('/deleteUser', authMiddleware, eliminaUsuario)
router.get('/profile', authMiddleware, displayUserProfile)
router.post('/changePassword', authMiddleware, cambiaPassword)
router.post('/register', registraUsuario)
router.post('/login', compruebaUsuario)
router.post('/', createItem)
router.post('/links', authMiddleware, validateCreateLink, createItem)
router.post('/columnas', authMiddleware, validateCreateColumn, createColItem)
router.post('/escritorios', authMiddleware, validateCreateDesktop, createDeskItem)
router.post('/linkNotes', authMiddleware, setNotes)
router.post('/uploadImgProfile', authMiddleware, upload.single('file'), uploadProfileImage)
router.post('/uploadLinkImg', authMiddleware, upload.single('linkImg'), uploadLinkIcon)
router.delete('/deleteImg', authMiddleware, deleteImage)
router.delete('/links', authMiddleware, deleteItem)
router.delete('/columnas', authMiddleware, deleteColItem)
router.delete('/escritorios', authMiddleware, deleteDeskItem)
router.put('/links', authMiddleware, validateEditLink, editItem)
router.put('/columnas', authMiddleware, validateEditColumn, editColItem)
router.put('/escritorios', authMiddleware, validateEditDesktop, editDeskItem)
router.put('/draglinks', editdragItem)
router.put('/draglink', actualizarOrdenElementos)
router.put('/dragcol', actualizarOrdenColumnas)
router.put('/ordenaDesks', authMiddleware, ordenaDesks)
router.put('/moveLinks', authMiddleware, moveItem)
router.put('/moveCols', authMiddleware, moveColumns)
module.exports = router
