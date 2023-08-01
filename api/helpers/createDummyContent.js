const { escritoriosModel, usersModel, linksModel, columnasModel } = require('../models/index')
const { createItem } = require('../controllers/links')
const fs = require('fs')
const path = require('path')

const readFile = (fileName) => {
  try {
    const filePath = path.resolve(__dirname, fileName)
    const data = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(data)
    return jsonData
  } catch (error) {
    console.error('Error al leer el archivo:', error)
    return null
  }
}
const createDummyContent = async (user) => {
  // const filePath = './data.json'
  const fileName = 'data.json'
  const dummyData = readFile(fileName)
  if (dummyData) {
    // El archivo se leyó correctamente
    // console.log(dummyData)
    // Puedes trabajar con el objeto JSON aquí
    await Promise.all(dummyData.escritorios.map(async element => {
      element.user = user
      await escritoriosModel.create(element)
      // console.log(`Escritorio Creado ${createdDesk}`)
      return element
    }))
    await Promise.all(dummyData.columnas.map(async (element) => {
      element.user = user
      await columnasModel.create(element)
      return element
    }))

    await usersModel.findOneAndUpdate({ name: `${user}` }, { $set: { newUser: 'false' } }, // La propiedad a actualizar
      { new: true })

    const fileNameLinks = 'dataLinks.json'
    const dummyDataLinks = readFile(fileNameLinks)
    Object.entries(dummyDataLinks).forEach(async function ([propiedad, valor]) {
      // console.log(`Elementos insertados en ${propiedad}`)
      Object.entries(valor).forEach(async function ([propiedad, valor]) {
        const column = await columnasModel.find({ name: `${valor.columna}` })
        // console.log(column)
        const object = {
          name: valor.name,
          URL: valor.URL,
          imgURL: `https://www.google.com/s2/favicons?domain=${valor.URL}`,
          orden: valor.orden,
          escritorio: valor.escritorio,
          user, // Pasar user
          idpanel: column[0].id, // Pasar idpanel
          columna: valor.columna
        }
        // console.log(object)
        await linksModel.create(object)
      })
    })
    return dummyData
  }
}
const insertLinks = (req, res) => {
  const user = 'Paco'
  const fileNameLinks = 'dataLinks.json'
  const dummyDataLinks = readFile(fileNameLinks)
  Object.entries(dummyDataLinks).forEach(function ([propiedad, valor]) {
    // console.log(`Elementos insertados en ${propiedad}`)
    Object.entries(valor).forEach(async function ([propiedad, valor]) {
      const column = await columnasModel.find({ name: `${valor.columna}` })
      // console.log(column)
      const object = {
        name: valor.name,
        URL: valor.URL,
        imgURL: `https://www.google.com/s2/favicons?domain=${valor.URL}`,
        orden: valor.orden,
        escritorio: valor.escritorio,
        user, // Pasar user
        idpanel: column[0].id, // Pasar idpanel
        columna: valor.columna
      }
      // console.log(object)
    })
    // console.log(`Links en ${propiedad} = ${valor}`)
  })
  res.send(dummyDataLinks)
}

module.exports = { createDummyContent, insertLinks }
