const { escritoriosModel, linksModel, columnasModel } = require('../models/index')
const fs = require('fs')

async function restore (req, res) {
  const user = req.user.name
  const backupFilePath = req.file.path

  try {
    // Leer el archivo de copia de seguridad
    const data = fs.readFileSync(backupFilePath, 'utf8')
    const jsonData = JSON.parse(data)

    // Borrar los documentos existentes en las colecciones
    await escritoriosModel.deleteMany({ user })
    await columnasModel.deleteMany({ user })
    await linksModel.deleteMany({ user })

    // Insertar los documentos de la copia de seguridad en las colecciones
    await escritoriosModel.insertMany(jsonData.escritorios)
    await columnasModel.insertMany(jsonData.columnas)
    await linksModel.insertMany(jsonData.links)
    const mensaje = 'Copia de seguridad restaurada correctamente.'

    console.log('Copia de seguridad restaurada correctamente.')
    res.send({ mensaje })
  } catch (error) {
    const mensaje = 'Error al restaurar la copia de seguridad'
    console.error('Error al restaurar la copia de seguridad:', error)
    res.send({ mensaje })
  }
}

module.exports = { restore }
