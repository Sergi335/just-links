const { linksModel } = require('../models/index')

const setLinksOrder = async (elementos, idpanel) => {
  try {
    // Creamos un mapa para almacenar el orden actual de los elementos
    const ordenActual = new Map()
    let orden = 0
    elementos.forEach((elemento) => {
      ordenActual.set(elemento, orden)
      orden++
    })
    console.log(ordenActual)
    // Actualizamos el campo "orden" de cada elemento en la base de datos
    const updates = elementos.map(async (elemento) => {
      const orden = ordenActual.get(elemento)
      await linksModel.findOneAndUpdate(
        { _id: elemento, idpanel },
        { orden },
        { new: true }
      )
    })
    await Promise.all(updates)
    // Innecesario
    const data = await linksModel.find({ idpanel }).sort({ orden: 1 })
    return data
  } catch (error) {
    console.error(error)
  }
}
module.exports = { setLinksOrder }
