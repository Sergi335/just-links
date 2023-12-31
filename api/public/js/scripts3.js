import { darHora, saludo, fetchS, sendMessage, handleDbClick, preEditColumn, handleSimpleClick, getCookieValue, openTab, constants, formatPath, sortSideInfo } from './functions.mjs'
import { togglePanel, navLinkInfos } from './sidepanel.js'
import { groupBy, putIntoView, handleLinkHeight } from './styles.js'

document.addEventListener('DOMContentLoaded', cargaWeb)
document.addEventListener('click', escondeDialogos)

/**
 * Función que carga los eventos en la web
 */
function cargaWeb () {
  if (window.location.pathname !== '/profile') {
    const deskName = document.body.getAttribute('data-desk')
    const $columnsRoot = document.getElementById(`${deskName}Cols`)
    const columns = Array.from($columnsRoot.childNodes)
    // testImages()
    addDesktopEvents()
    darHora()
    saludo()
    handleDbClick()
    handleSimpleClick()
    addContextMenuEvents()
    addColumnEvents()
    // Locura que si no llamas a ordenacols dos veces en dos funciones distintas(cierto?), no funciona, tocatelos
    addLinkEvents($columnsRoot)
    // Esto debe estar en profile tmb
    document.onscroll = () => {
      toggleBotonSubirArriba()
    }
    if (window.matchMedia('(min-width: 1536px)').matches) {
      if (!document.body.classList.contains('edit')) {
        ordenaItems(columns)
        ordenaCols($columnsRoot)
      }
      ordenaDesks()
    }
    $columnsRoot.style.opacity = 1
  }
}

// Manejo de Eventos

/**
 * Carga los manejadores de eventos para la manipulación de escritorios
 */
function addDesktopEvents () {
  // Agregar evento de clic al botón para agregar una columna
  document.querySelector('#addCol').removeEventListener('click', toggleDialogColumn)
  document.querySelector('#addCol').addEventListener('click', toggleDialogColumn)

  // Agregar evento de clic al botón para cambiar Layout
  document.querySelector('#selectLayout').removeEventListener('click', changeLayout)
  document.querySelector('#selectLayout').addEventListener('click', changeLayout)

  // Agregar evento de clic al botón para agregar un escritorio
  document.querySelector('#addDesk').removeEventListener('click', toggleDialogDesktop)
  document.querySelector('#addDesk').addEventListener('click', toggleDialogDesktop)

  // Agregar evento de clic al botón para editar un escritorio
  document.querySelector('#editDesk').removeEventListener('click', toggleDialogEditDesktop)
  document.querySelector('#editDesk').addEventListener('click', toggleDialogEditDesktop)

  // Agregar evento de clic al botón submit de editar un escritorio
  document.querySelector('#editdeskSubmit').removeEventListener('click', editDesktop)
  document.querySelector('#editdeskSubmit').addEventListener('click', editDesktop)

  // Agregar evento de clic al botón para eliminar un escritorio
  document.querySelector('#removeDesk').removeEventListener('click', toggleDeleteDialogDesk)
  document.querySelector('#removeDesk').addEventListener('click', toggleDeleteDialogDesk)
  // Agregar evento de clic al botón para confirmar eliminacion de un escritorio
  document.querySelector('#confDeletedeskSubmit').removeEventListener('click', deleteDesktop)
  document.querySelector('#confDeletedeskSubmit').addEventListener('click', deleteDesktop)
  // Agregar evento de clic al botón para confirmar eliminacion de un escritorio
  document.querySelector('#noDeletedeskSubmit').removeEventListener('click', escondeDeleteDeskDialog)
  document.querySelector('#noDeletedeskSubmit').addEventListener('click', escondeDeleteDeskDialog)
  // Añadir eventos en botones submit de crear escritorio
  document.querySelector('#deskSubmit').removeEventListener('click', createDesktop)
  document.querySelector('#deskSubmit').addEventListener('click', createDesktop)

  // Agregar evento de clic al botón de cerrar sesión
  document.querySelector('#logout').removeEventListener('click', logOut)
  document.querySelector('#logout').addEventListener('click', logOut)

  // Agregar evento de clic al botón de ir a perfil
  document.querySelector('#profile').removeEventListener('click', profile)
  document.querySelector('#profile').addEventListener('click', profile)
  if (!document.body.classList.contains('edit')) {
    document.getElementById('btnSubirArriba').addEventListener('click', scrollToTop)
  }
  document.getElementById('hidePanels').removeEventListener('click', hidePanels)
  document.getElementById('hidePanels').addEventListener('click', hidePanels)
}
/**
 * Carga los manejadores de eventos para la manipulación de columnas
 */
function addColumnEvents () {
  document.querySelectorAll('.borracol').forEach(item => {
    item.removeEventListener('click', toggleDeleteDialogCol)
    item.addEventListener('click', toggleDeleteDialogCol)
  })
  // Agregar evento de clic al botón de añadir links
  document.querySelectorAll('.addlink').forEach(item => {
    item.removeEventListener('click', toggleDialogLink)
    item.addEventListener('click', toggleDialogLink)
  })
  // Agregar evento de clic al botón de editar columnas
  document.querySelectorAll('.editcol').forEach(item => {
    item.removeEventListener('click', preEditColumn)
    item.addEventListener('click', preEditColumn)
  })

  document.querySelectorAll('.paste-btn').forEach(item => {
    item.removeEventListener('click', pasteLink)
    item.addEventListener('click', pasteLink)
  })
  document.querySelector('#colSubmit').removeEventListener('click', createColumn)
  document.querySelector('#colSubmit').addEventListener('click', createColumn)

  document.querySelector('#confDeletecolSubmit').removeEventListener('click', deleteColumn)
  document.querySelector('#confDeletecolSubmit').addEventListener('click', deleteColumn)

  document.querySelector('#noDeletecolSubmit').removeEventListener('click', escondeDeleteColDialog)
  document.querySelector('#noDeletecolSubmit').addEventListener('click', escondeDeleteColDialog)
}
/**
 * Carga los manejadores de eventos para la manipulación de links
 */
function addLinkEvents ($raiz) {
  document.querySelectorAll('.borralink').forEach(item => {
    item.removeEventListener('click', toggleDeleteDialogLink)
    item.addEventListener('click', toggleDeleteDialogLink)
  })
  document.querySelectorAll('.editalink').forEach(item => {
    item.removeEventListener('click', toggleDialogEditLink)
    item.addEventListener('click', toggleDialogEditLink)
  })
  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#linkSubmit').removeEventListener('click', createLink)
  document.querySelector('#linkSubmit').addEventListener('click', createLink)

  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#editlinkSubmit').removeEventListener('click', editLink)
  document.querySelector('#editlinkSubmit').addEventListener('click', editLink)

  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#confDeletelinkSubmit').removeEventListener('click', deleteLink)
  document.querySelector('#confDeletelinkSubmit').addEventListener('click', deleteLink)

  // Agregar evento de clic al botón de envío dentro del cuadro de diálogo
  document.querySelector('#noDeletelinkSubmit').removeEventListener('click', escondeDeleteDialog)
  document.querySelector('#noDeletelinkSubmit').addEventListener('click', escondeDeleteDialog)
  document.querySelectorAll('div.link').forEach(link => {
    link.removeEventListener('click', setLastVisited)
    link.addEventListener('click', setLastVisited)
  })
  if (window.matchMedia('(min-width: 1536px)').matches) {
    if (!document.body.classList.contains('edit')) {
      ordenaCols($raiz)
    }
  }
}
function addContextMenuEvents () {
  // Obtener todos los elementos de la página en los que hay que habilitar el menú emergente
  const headers = document.querySelectorAll('.headercolumn')
  headers.forEach(head => {
    head.removeEventListener('contextmenu', mostrarMenu)
    head.addEventListener('contextmenu', mostrarMenu)
  })
  const links = document.querySelectorAll('.link')
  links.forEach(link => {
    link.removeEventListener('contextmenu', mostrarMenu)
    link.addEventListener('contextmenu', mostrarMenu)
  })
  // Añadir buttons de editmode
  const buttons = document.querySelectorAll('.tablinks')
  buttons.forEach(button => {
    button.removeEventListener('contextmenu', mostrarMenu)
    button.addEventListener('contextmenu', mostrarMenu)
  })
  // Obtener los elementos del submenu mover columna
  const menuMoveColItems = document.querySelectorAll('#destDesk li')

  // Añadir un event listener a cada uno
  menuMoveColItems.forEach(function (item) {
    item.addEventListener('click', moveColumns)
  })

  // Obtener los elementos del submenu mover link
  const menuMoveLinkItems = document.querySelectorAll('#destCol li')

  // Añadir un event listener a cada uno
  menuMoveLinkItems.forEach(function (item) {
    item.addEventListener('click', moveLinks)
  })

  // Menu mover entre escritorios
  const acc = document.getElementsByClassName('accordion')
  let i

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', function (event) {
      if (event.target !== this) {
        event.stopPropagation()
        return
      }
      console.log(event.target)
      this.classList.toggle('ddactive')
      const panel = this.childNodes[2]
      console.log(panel)
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px'
      }
    })
  }
  const otherDesk = document.getElementById('otherDesk')
  otherDesk.removeEventListener('click', handleOtherDeskMove)
  otherDesk.addEventListener('click', handleOtherDeskMove)
  const cancelMove = document.getElementById('cancelMove')
  cancelMove.removeEventListener('click', handleOtherDeskMove)
  cancelMove.addEventListener('click', handleOtherDeskMove)
  const destinations = document.querySelectorAll('li.accordion ul li')
  destinations.forEach(destination => {
    destination.removeEventListener('click', selectDestination)
    destination.addEventListener('click', selectDestination)
  })
}
// Manejo de escritorios
/**
 * Función para editar el nombre de un escritorio, refact xx
 * llama a fetch - si hay error llama a funcion de message - si no esconde dialogos, llama a refreshDesktops y adddesktopEvents - marca el desk actual como activo en la lista - cambia la url con el nombre de la url actualizada
 */
async function editDesktop (event) {
  // No sirve habrá que quitar el form
  event.preventDefault()
  const oldName = document.body.getAttribute('data-desk')
  const newName = document.getElementById('editdeskName').value.trim()
  const newNameFormat = formatPath(newName)

  const body = { newName, newNameFormat, oldName }
  const params = {
    url: `${constants.BASE_URL}/escritorios`,
    body,
    method: 'PUT',
    options: {
      contentType: 'application/json'
    }
  }
  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
    } else {
      sendMessage(false, `${firstKey}, ${firstValue}`)
    }
  } else {
    // TODO esto se repite mucho, pero no hay algo ya que esconde dialogos?
    const dialog = document.getElementById('editDeskForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    refreshDesktops(res)
    addDesktopEvents()
    document.getElementById('deskTitle').innerText = `${newName}`
    const buttons = document.querySelectorAll('a.deskList')
    buttons.forEach(button => {
      if (button.innerText === newName) {
        button.classList.add('active')
      }
    })
    const url = new URL(window.location.href)
    url.pathname = `${newNameFormat}`
    window.history.pushState(null, null, url)
    sendMessage(true, 'Edición Correcta')
  }
  // TODO animar el cambio de nombre??
}
/**
 * Función para crear un escritorio, refact xx - todo mensaje exito
 */
async function createDesktop () {
  const displayName = document.getElementById('deskName').value.trim()
  const name = formatPath(displayName)
  let orden = document.querySelectorAll('a.deskList')
  orden = orden.length + 1
  const body = { name, displayName, orden }
  const params = {
    url: `${constants.BASE_URL}/escritorios`,
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)

  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
    } else {
      sendMessage(false, `${firstKey}, ${firstValue}`)
    }
  } else {
    window.location = `/desktop/${name}`
    // Mensaje exito despues
    // sacar a constante /desktop/
  }
}
/**
 * Función para borrar un escritorio, refact xx
 */
async function deleteDesktop () {
  const name = document.body.getAttribute('data-desk')
  const body = { name }
  const params = {
    url: `${constants.BASE_URL}/escritorios`,
    method: 'DELETE',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    sendMessage(false, `${firstKey}, ${firstValue}`)
  } else {
    window.location = `/${res[0].name}`
    // Necesario??
    const dialog = document.getElementById('deleteDeskForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
  }
}
/**
 * Función que recarga la lista de escritorios disponibles
 * @param {*} lista
 */
function refreshDesktops (lista) {
  // Declaramos la raiz donde va la lista de escritorios
  const $raiz = document.getElementById('drpEscritorios')
  // Convertimos el Json en Array
  const arr = Array.from(lista)
  // Si la raiz tiene hijos los vaciamos todos
  if ($raiz.hasChildNodes()) {
    while ($raiz.childNodes.length >= 1) {
      $raiz.removeChild($raiz.firstChild)
    }
  }

  arr.forEach(element => {
    const $nodos = document.createElement('a')
    $nodos.setAttribute('class', 'deskList')
    $nodos.setAttribute('href', `/${element.name}`)
    const $textos = document.createTextNode(`${element.displayName}`)

    $nodos.appendChild($textos)
    $raiz.appendChild($nodos)
  })
}
/**
 * Función para cambiar el layout de la pagina
 */
function changeLayout (event) {
  console.log('Funciona')
  event.stopPropagation()
  const deskName = document.body.getAttribute('data-desk')
  // Si existe la cookie
  if (getCookieValue('mode') !== null) {
    console.log('Entro al if')
    if (getCookieValue('mode') === 'edit') {
      document.cookie = 'mode=normal'
      window.location = `/desktop/${deskName}`
      console.log('Modo normal')
    } else if (getCookieValue('mode') === 'normal') {
      document.cookie = 'mode=edit'
      window.location = `/desktop/${deskName}`
      console.log('Modo edit')
    }
  } else {
    document.cookie = 'mode=edit'
    window.location = `/desktop/${deskName}`
    console.log('Entro al else')
  }
}

// Manejo de columnas

/**
 * Función para editar una columna refact x no funciona bien el mensaje de exito
 */
export async function editColumn (name, desk, idPanel) {
  const nombre = name
  const escritorio = desk
  const id = idPanel
  const body = { nombre, escritorio, id }
  const params = {
    url: `${constants.BASE_URL}/columnas`,
    method: 'PUT',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  // console.log(res)
  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
    } else {
      sendMessage(false, `${firstKey}, ${firstValue}`)
    }
  } else {
    const sidePanel = document.getElementById(`Side${desk}${res.name}`)
    sidePanel.innerText = nombre
    sendMessage(true, 'Nombre Cambiado!!')
  }
}
/**
 * Función para crear columna refact xx
 */
async function createColumn () {
  const nombre = document.getElementById('colName').value.trim()
  const escritorio = document.body.getAttribute('data-desk')
  // If body.class edit -> else
  let $raiz0
  if (document.body.classList.contains('edit')) {
    $raiz0 = document.querySelector('.tab')
  } else {
    $raiz0 = document.getElementById(`${escritorio}Cols`)
  }

  const orden = $raiz0.childNodes.length // es + 1 en edit por lo menos
  console.log(orden)

  const body = { nombre, escritorio, orden }

  const params = {
    url: `${constants.BASE_URL}/columnas`,
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body
  }

  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
    } else {
      sendMessage(false, `${firstKey}, ${firstValue}`)
    }
  } else {
    const menuMoverLink = document.getElementById('destCol')
    const itemLista = document.createElement('li')
    itemLista.setAttribute('id', `${nombre}`)
    const text = document.createTextNode(`${nombre}`)
    itemLista.appendChild(text)
    menuMoverLink.appendChild(itemLista)
    // Obtener los elementos del submenu mover link
    const menuMoveLinkItems = document.querySelectorAll('#destCol li')

    // Añadir un event listener a cada uno
    menuMoveLinkItems.forEach(function (item) {
      item.removeEventListener('click', moveLinks)
      item.addEventListener('click', moveLinks)
    })
    // al crear desde escritorio vacio no hay sideBlocks
    const sideBlocks = Array.from(document.querySelectorAll('.sect'))
    if (sideBlocks.length > 0) {
      const lastSideBlock = sideBlocks.at(-1)
      const newChild = document.createElement('a')
      newChild.setAttribute('id', `Side${escritorio}${nombre}`)
      newChild.innerText = `${nombre}`
      lastSideBlock.appendChild(newChild)
      console.log(lastSideBlock)
    } else {
      const sideInfoRoot = document.getElementById('sectContainer')
      const sideBlock = document.createElement('div')
      sideBlock.setAttribute('class', 'sect')
      const newChild = document.createElement('a')
      newChild.setAttribute('id', `Side${escritorio}${nombre}`)
      newChild.innerText = `${nombre}`
      sideBlock.appendChild(newChild)
      sideInfoRoot.appendChild(sideBlock)
    }
    // Ojo
    refreshColumns(res)
    const dialog = document.getElementById('addColForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
  }
}
/**
 * Función para borrar una columna refact x
 */
async function deleteColumn () {
  const dialog = document.getElementById('deleteColForm')
  const visible = dialog.style.display === 'flex'
  if (visible) {
    dialog.style.display = 'none'
  }
  const escritorio = document.body.getAttribute('data-desk')
  const elementoId = document.getElementById('confDeletecolSubmit').getAttribute('sender')
  const body = { id: elementoId }
  const params = {
    url: `${constants.BASE_URL}/columnas`,
    method: 'DELETE',
    options: {
      contentType: 'application/json'
    },
    body
  }

  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    const $error = document.getElementById('deleteColError')
    $error.innerText = `${firstKey}, ${firstValue}`
  } else {
    const $colBorrar = document.querySelector(`[data-db="${elementoId}"]`)
    if (!document.body.classList.contains('edit')) {
      $colBorrar.parentNode.remove()
    } else {
      // Actualizar los ordenes de ambos
      $colBorrar.remove()
      const $tabcontent = document.querySelector(`[data-db="edit${elementoId}"]`).parentNode
      $tabcontent.remove()
      const columns = document.querySelectorAll('.tablinks')
      if (columns) {
        columns[0].click()
      }
    }
    const sidePanel = document.getElementById(`Side${escritorio}${res.name}`)
    const sideParent = sidePanel.parentNode
    console.log(`Side${escritorio}${res.name}`)
    console.log(sidePanel)
    sidePanel.remove()
    if (sideParent.childElementCount === 0) {
      sideParent.remove()
    }
    sendMessage(true, 'Columna Borrada!!')
  }
}
/**
 * Función para mover una columna entre escritorios refact xx
 * @param {} event
 */
async function moveColumns (event) {
  console.log(event.target.id)
  const deskOrigen = document.body.getAttribute('data-desk')
  const deskDestino = event.target.id
  const colId = event.target.parentNode.parentNode.parentNode.childNodes[1].innerText

  console.log(deskOrigen)
  console.log(deskDestino)
  console.log(colId)
  const body = { deskOrigen, deskDestino, colId }
  const params = {
    url: `${constants.BASE_URL}/moveCols`,
    method: 'PUT',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  console.log(res)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error') {
    sendMessage(false, `${firstKey}, ${firstValue}`)
  } else {
    let $raiz
    if (!document.body.classList.contains('edit')) {
      $raiz = document.querySelector(`[data-db="${colId}"]`)
      $raiz.parentNode.remove()
      console.log($raiz.parentNode)
    } else {
      const elems = document.querySelectorAll(`[data-db="${colId}"]`)
      elems.forEach(elem => {
        elem.remove()
      })
      // Y si no hay buttons?
      const buttons = document.querySelectorAll('.tablinks')
      if (buttons.length > 0) {
        buttons[0].click()
      }
    }
    sendMessage(true, 'Columna Movida!!')
  }
}
/**
 * Función que crea la columna cuando se crea con createColumn refact xx
 * Recibe la columna creada
 * @param {json} json
 */
async function refreshColumns (json) {
  console.log(json[0])
  console.log(json[0].name)
  console.log(json[0]._id)

  const nombre = json[0].name
  const id = json[0]._id
  const orden = json[0].order
  console.log(orden)
  const escritorioActual = document.body.getAttribute('data-desk')

  if (!document.body.classList.contains('edit')) {
    const $raiz = document.getElementById(`${escritorioActual}Cols`)
    const arr = []

    document.querySelectorAll('.headercolumn').forEach(element => {
      console.log(element.childNodes[0].innerText)
      arr.push(element.childNodes[0].innerText)
    })
    console.log(arr)

    const $columna = document.createElement('div')
    $columna.setAttribute('class', 'columna')

    // Permite detectar duplicados y darles un id distinto incremental, luego cuando se refresque la pag lo implementa en plantilla

    const count = arr.reduce((acc, currentValue) => {
      if (currentValue === nombre) {
        return acc + 1
      } else {
        return acc
      }
    }, 0)
    console.log(count)
    if (count > 0) {
      $columna.setAttribute('id', `${escritorioActual}${nombre}${count + 1}`)
    } else {
      $columna.setAttribute('id', `${escritorioActual}${nombre}`)
    }

    $columna.setAttribute('data-db', `${id}`)

    const $div = document.createElement('div')
    $div.setAttribute('class', 'link')
    $columna.appendChild($div)

    const $envolt = document.createElement('div')
    $envolt.setAttribute('class', 'envolt')
    $envolt.setAttribute('orden', `${orden}`)
    const $headerColumn = document.createElement('div')
    $headerColumn.setAttribute('class', 'headercolumn')
    const $header = document.createElement('h2')
    $header.setAttribute('class', 'ctitle')
    const $textos = document.createTextNode(`${nombre}`)

    $header.appendChild($textos)
    $headerColumn.appendChild($header)

    $envolt.appendChild($headerColumn)
    $envolt.appendChild($columna)

    $raiz.appendChild($envolt)
    if (window.localStorage.getItem('columnWidth')) {
      $envolt.style.width = JSON.parse(window.localStorage.getItem('columnWidth'))
    } else {
      $envolt.style.width = constants.COLUMN_WIDTH
    }
    const container = document.getElementById(`${escritorioActual}Cols`)
    const hijos = Array.from(container.childNodes)
    const elements = Array.from(document.querySelectorAll('.sect'))
    if (window.localStorage.getItem('columns')) {
      groupBy(elements, Number(JSON.parse(window.localStorage.getItem('columns'))))
    } else {
      groupBy(elements, constants.COLUMN_COUNT)
    }
    const sideBlocks = Array.from(document.querySelectorAll('.sect'))
    sideBlocks.forEach(panel => {
      panel.removeEventListener('click', putIntoView)
      panel.addEventListener('click', putIntoView)
    })
    addColumnEvents()
    ordenaItems(hijos)
    ordenaCols($raiz)
    $headerColumn.addEventListener('contextmenu', mostrarMenu)
  } else {
    const $raiz = document.querySelector('.tab')
    const orden = $raiz.childElementCount
    const arr = []
    document.querySelectorAll('.tablinks').forEach(element => {
      console.log(element.innerText)
      arr.push(element.innerText)
    })
    console.log(arr)

    const $button = document.createElement('button')
    $button.setAttribute('class', 'tablinks')
    $button.classList.add('envolt')

    const count = arr.reduce((acc, currentValue) => {
      if (currentValue === nombre) {
        return acc + 1
      } else {
        return acc
      }
    }, 0)
    console.log(count)
    if (count > 0) {
      $button.setAttribute('id', `${escritorioActual}${nombre}${count + 1}`)
    } else {
      $button.setAttribute('id', `${escritorioActual}${nombre}`)
    }
    $button.setAttribute('orden', `${orden}`)
    $button.setAttribute('data-db', `${id}`)
    const $textos = document.createTextNode(`${nombre}`)
    $button.appendChild($textos)
    $raiz.appendChild($button)

    const $raiz2 = document.getElementById(`${escritorioActual}Cols`)
    const $tabcontent = document.createElement('div')
    $tabcontent.setAttribute('class', 'tabcontent')

    if (count > 0) {
      $tabcontent.setAttribute('id', `edit${escritorioActual}${nombre}${count + 1}`)
    } else {
      $tabcontent.setAttribute('id', `edit${escritorioActual}${nombre}`)
    }
    $tabcontent.setAttribute('orden', `${orden}`)
    const $columna = document.createElement('div')
    $columna.setAttribute('class', 'columna')
    $columna.setAttribute('data-db', `edit${id}`)
    if (count > 0) {
      $columna.setAttribute('id', `${escritorioActual}${nombre}${count + 1}`)
    } else {
      $columna.setAttribute('id', `${escritorioActual}${nombre}`)
    }
    $tabcontent.appendChild($columna)
    // Pedir sidepanel e introducir en tabcontent
    // const data = await fetch('http://localhost:3001/sidepanel', {
    //   method: 'GET',
    //   options: {
    //     contentType: 'application/json'
    //   }
    // })
    // const html = await data.text()
    // console.log('🚀 ~ file: scripts3.js:695 ~ refreshColumns ~ data:', html)
    const $div = document.createElement('div')
    $div.setAttribute('class', 'link')
    $columna.appendChild($div)
    const penultimoElemento = $raiz2.children[$raiz2.children.length - 1]
    $raiz2.insertBefore($tabcontent, penultimoElemento)
    // $raiz2.appendChild($tabcontent)
    $tabcontent.style.display = 'none'
    const columnas = document.querySelectorAll('.tablinks')
    console.log('🚀 ~ file: scripts3.js:703 ~ refreshColumns ~ columnas:', columnas)
    columnas.forEach(col => {
      col.removeEventListener('click', openTab)
      col.addEventListener('click', openTab)
    })
    // $tabcontent.innerHTML += html
    addColumnEvents()
    if (!constants.EDIT_MODE) {
      ordenaItems(nombre)
      ordenaCols($raiz)
    }
  }
}

// Manejo de links

/**
 * Función para editar un link refact xx
 */
async function editLink () {
  // como podemos indicar que el edit viene del search?
  const id = document.body.getAttribute('data-link')
  const description = document.querySelector('#editlinkDescription').value.trim()
  const nombre = document.querySelector('#editlinkName').value.trim()
  const linkURL = document.querySelector('#editlinkURL').value.trim()
  const dbID = document.getElementById('editlinkSubmit').getAttribute('sender')

  const body = { id, fields: { name: nombre, URL: linkURL, description } }
  console.log(body)
  const params = {
    url: `${constants.BASE_URL}/links`,
    method: 'PATCH',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  console.log(res)
  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
    } else {
      sendMessage(false, `${firstKey}, ${firstValue}`)
    }
  } else {
    const dialog = document.getElementById('editLinkForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    if (!document.body.classList.contains('edit')) {
      const $raiz = document.querySelector(`[data-db="${dbID}"]`)
      if ($raiz) {
        const arr = Array.from($raiz.childNodes)
        console.log(arr)
        // si permitimos mismo nombre esto habrá que cambiarlo tmb (elementp.id?)
        const elementoAEditar = arr.find((elemento) => elemento.id === id)
        if (elementoAEditar) {
          // llamar a refreshlinks
          console.log(elementoAEditar)
          elementoAEditar.querySelector('img').src = res.imgURL
          elementoAEditar.querySelector('a').href = res.URL
          elementoAEditar.querySelector('.title').innerText = nombre
          elementoAEditar.querySelector('.description').innerText = description
        }
      } else {
        // ha sido editado desde la lista de resultados de búsqueda
        sendMessage(true, 'Link Editado Correctamente')
      }
    } else {
      const $raiz = document.querySelector(`[data-db="edit${dbID}"]`)
      const sidePanelText = document.getElementById('lname')
      const arr = Array.from($raiz.childNodes)
      console.log(arr)
      const elementoAEditar = arr.find((elemento) => elemento.id === id)
      if (elementoAEditar) {
        elementoAEditar.querySelector('img').src = res.imgURL
        elementoAEditar.querySelector('a').href = res.URL
        elementoAEditar.querySelector('.title').innerText = nombre
        elementoAEditar.querySelector('.description').innerText = description
      }
      sidePanelText.innerText = nombre
    }
    sendMessage(true, 'Link Editado Correctamente')
  }
}
/**
 * Función para crear un link refact xx
 */
async function createLink () {
  // Recogemos los datos para enviarlos a la db
  const escritorio = document.body.getAttribute('data-desk')
  const panel = document.body.getAttribute('data-panel')
  const nombre = document.querySelector('#linkName').value.trim()
  const linkURL = document.querySelector('#linkURL').value.trim()
  const imgURL = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${linkURL}&size=64`
  const idpanel = document.getElementById('linkSubmit').getAttribute('sender')
  // Seleccionamos columna por id, por si hay dos con el mismo nombre
  let $raiz
  if (!document.body.classList.contains('edit')) {
    $raiz = document.querySelector(`[data-db="${idpanel}"]`)
  } else {
    const id = idpanel.replace(/edit/g, '')
    $raiz = document.querySelector(`[data-db="${id}"]`)
  }

  let orden = $raiz.childNodes.length
  orden = orden + 1
  console.log(orden)

  // Declaramos el body para enviar
  const body = { idpanel, data: [{ name: nombre, URL: linkURL, imgURL, escritorio, panel, idpanel, orden }] }
  const params = {
    url: '/api/links',
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)

  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
    } else {
      sendMessage(false, `${firstKey}, ${firstValue}`)
    }
  } else {
    // Cerramos el cuadro de diálogo
    const dialog = document.getElementById('addLinkForm')
    const visible = dialog.style.display === 'flex'
    dialog.style.display = visible ? 'none' : 'flex'
    // La rellenamos con los datos del json
    refreshLinks(res)
    sendMessage(true, 'Enlace Creado Correctamente')
  }
}
/**
 * Función para borrar un link refact xx
 */
async function deleteLink () {
  const dialog = document.getElementById('deleteLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'

  const linkId = document.body.getAttribute('data-link')
  const idpanel = document.getElementById('confDeletelinkSubmit').getAttribute('sender')
  const escritorio = document.body.getAttribute('data-desk')

  const body = { linkId, escritorio, idpanel }
  const params = {
    url: `${constants.BASE_URL}/links`,
    method: 'DELETE',
    options: {
      contentType: 'application/json'
    },
    body
  }

  const res = await fetchS(params)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    sendMessage(false, `${firstKey}, ${firstValue}`)
  } else {
    let $raiz
    if (!document.body.classList.contains('edit')) {
      $raiz = document.querySelector(`[data-db="${idpanel}"]`)
    } else {
      $raiz = document.querySelector(`[data-db="edit${idpanel}"]`)
    }
    if ($raiz) {
      console.log($raiz.childNodes)
      const arr = Array.from($raiz.childNodes)
      console.log(arr)
      const elementoABorrar = arr.find((elemento) => elemento.id === linkId)
      if (elementoABorrar) {
        elementoABorrar.remove()
      }
      if (res.length === 0) {
        console.log('Era el último')
        const $div = document.createElement('div')
        $div.setAttribute('class', 'link')
        $raiz.appendChild($div)
      }
    } else {
      // Se ha borrado desde la lista de resultados de busqueda
      sendMessage(true, 'Enlace Borrado!')
    }
    sendMessage(true, 'Enlace Borrado!')
  }
}
/**
 * Función para mover un link de una columna a otra en el mismo desktop refact xx
 * @param {} event
 */
async function moveLinks (event) {
  const menu = document.getElementById('menuLink')
  const menuVisible = menu.style.display === 'flex'
  if (menuVisible) {
    menu.style.display = 'none'
  }
  if (document.body.classList.contains('edit')) {
    moveLinksEdit(event)
  } else {
    // se necesita para el testDummy
    const idpanelOrigen = document.body.getAttribute('idpanel')
    const panel = event.target.innerText
    const id = document.body.getAttribute('data-link')
    const idpanel = event.target.dataset.db
    const orden = document.querySelectorAll(`[data-db="${idpanel}"]`)[0].childNodes.length

    const body = { id, idpanelOrigen, fields: { idpanel, panel, orden } }
    const params = {
      url: `${constants.BASE_URL}/links`,
      method: 'PATCH',
      options: {
        contentType: 'application/json'
      },
      body
    }
    const res = await fetchS(params)
    const firstKey = Object.keys(res)[0]
    const firstValue = res[firstKey]

    if (firstKey === 'error') {
      const $error = document.getElementById('moveError') // Crear
      $error.innerText = `${firstKey}, ${firstValue}`
    } else {
      // Recogemos los links para detectar el movido y eliminarlo
      const links = document.querySelectorAll('div.link')
      if (links) {
        links.forEach(element => {
          if (element.id === res._id) element.remove()
        })
      }
    }
    refreshLinks(res)
    const testDummy = document.querySelectorAll(`[data-db="${idpanelOrigen}"]`)[0].childNodes.length
    if (testDummy === 0) {
      // Meter el dummy
      const dummy = document.createElement('div')
      dummy.setAttribute('class', 'link')
      document.querySelectorAll(`[data-db="${idpanelOrigen}"]`)[0].appendChild(dummy)
    }
  }
}
async function moveLinksEdit (event) {
  const linkId = document.body.getAttribute('data-link')
  const idpanelOrigen = document.body.getAttribute('idpanel')
  const panel = event.target.innerText
  let orden
  let idpanel
  const paneles = document.querySelectorAll('.tablinks')
  if (paneles) {
    paneles.forEach(element => {
      if (element.innerText === panel) {
        // Hacer algo con el elemento encontrado - y si hay duplicados???
        idpanel = element.dataset.db
        orden = document.querySelector(`[data-db="edit${idpanel}"]`).childElementCount
      }
    })
  }

  const body = { id: linkId, idpanelOrigen, fields: { idpanel, panel, orden } }
  console.log(body)
  const params = {
    url: `${constants.BASE_URL}/links`,
    method: 'PATCH',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  console.log('Resultado del servidor')
  console.log(res)
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    sendMessage(false, `${firstKey}, ${firstValue}`)
  } else {
    const links = document.querySelectorAll('div.link')
    if (links) {
      links.forEach(element => {
        // problema con duplicados, meter id de base de datos como id de elemento
        if (element.id === res._id) {
          console.log('Hay coincidencia con el enviado del servidor')
          console.log(element.id)
          console.log(res._id)
          // Hacer algo con el elemento encontrado
          element.remove()
        }
      })
    }
    const testDummy = document.querySelector(`[data-db="edit${idpanelOrigen}"]`).childElementCount
    if (testDummy === 0) {
      // Meter el dummy
      const dummy = document.createElement('div')
      dummy.setAttribute('class', 'link')
      testDummy.appendChild(dummy)
    }
    sendMessage(true, 'Link Movido Correctamente')
  }
  /* --- */
  // const elements = document.querySelectorAll(`[data-db="${idpanel}"]`)[0].childNodes
  // console.log('Elementos en panel de destino')
  // console.log(elements)
  // const id = elements[0].parentNode.getAttribute('data-db')
  // // console.log(id)
  // const sortedElements = Array.from(elements).sort((a, b) => {
  //   return a.dataset.orden - b.dataset.orden
  // })
  // console.log('Sorted elements')
  // console.log(sortedElements)
  // const names = []
  // sortedElements.forEach(element => {
  //   names.push(element.innerText)
  // })
  // console.log('nombres')
  // console.log(names)
  // body = names
  // const params2 = {
  //   url: `${constants.BASE_URL}/draglink?idColumna=`,
  //   method: 'PUT',
  //   options: {
  //     contentType: 'application/json',
  //     query: id
  //   },
  //   body
  // }
  // // La url /draglink ejecuta una función que actualiza el orden del link en la columna
  // const res2 = await fetchS(params2)
  // console.log('Segundo res del servidor')
  // console.log(res2)
  // const firstKey2 = Object.keys(res2)[0]
  // const firstValue2 = res2[firstKey2]

  // if (firstKey2 === 'error') {
  //   const $error = document.getElementById('linkError') // Crear
  //   $error.innerText = `${firstKey2}, ${firstValue2}`
  // } else {
  //   const testDummy = document.querySelectorAll(`[data-db="${idpanelOrigen}"]`)[0].childNodes.length
  //   if (testDummy === 0) {
  //   // Meter el dummy
  //     const dummy = document.createElement('div')
  //     dummy.setAttribute('class', 'link')
  //     document.querySelectorAll(`[data-db="${idpanelOrigen}"]`)[0].appendChild(dummy)
  //   }
  //   console.log('test dummy')
  //   console.log(testDummy)
  // }
  refreshLinks(res)
}
/**
 * Función para pegar links en columna refact x
 * @param {*} event
 */
async function pasteLink (event) {
  const menu = document.getElementById('menuColumn')
  const visible = menu.style.display === 'flex'
  if (visible) {
    menu.style.display = 'none'
  }
  // lee el contenido del portapapeles entonces ...
  // Arrow function anónima con los items de param
  navigator.clipboard.read().then((clipboardItems) => {
    // por cada clipboardItem ...
    for (const clipboardItem of clipboardItems) {
      // Si el length de la propiedad types es 1, es texto plano
      if (clipboardItem.types.length === 1) {
        // lo confirmamos
        for (const type of clipboardItem.types) {
          if (type === 'text/plain') {
            handlePastedTextLinks(event, clipboardItem, type)
          }
        }
      } else {
        for (const type of clipboardItem.types) {
          if (type === 'text/html') {
            handlePastedHtmlLinks(event, clipboardItem, type)
          }
          if (type.startsWith('image/')) {
            clipboardItem.getType(type).then((blob) => {
              console.log('Es una immagen:', blob)
            })
          }
        }
      }
    }
  })
}
const handlePastedTextLinks = (event, clipboardItem, type) => {
  // Pasamos el blob a texto
  clipboardItem.getType(type).then((blob) => {
    blob.text().then(function (text) {
      console.log(text)
      // Si tiene un enlace
      if (text.indexOf('http') === 0) {
        const urls = text.match(/https?:\/\/[^\s]+/g)
        if (urls.length > 1) {
          console.log('entramos')
          const raiz = event.target.parentNode.childNodes[1].innerText
          pasteMultipleLinks(urls, raiz)
          return
        }
        console.log('Tiene un enlace')
        processTextLinks(event, text)
      } else {
        console.log('Es texto plano sin enlace')
        console.log(text)
      }
    })
  })
}
async function processTextLinks (event, text) {
  const nombre = await getNameByUrl(text)
  const escritorio = document.body.getAttribute('data-desk')
  const url = text
  const columna = document.body.getAttribute('data-panel')
  const raiz = event.target.parentNode.childNodes[1].innerText
  const $raiz = document.querySelector(`[data-db="${raiz}"]`)
  const orden = $raiz.childNodes.length
  console.log(orden)
  const json = {
    idpanel: raiz,
    data: [{
      idpanel: raiz,
      name: nombre,
      URL: url,
      imgURL: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`,
      orden,
      escritorio,
      panel: columna
    }]

  }
  const params = {
    url: '/api/links',
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body: json
  }
  // TODO Gestion errores
  const res = await fetchS(params)
  console.log(res)
  refreshLinks(res)
}
const handlePastedHtmlLinks = (event, clipboardItem, type) => {
  clipboardItem.getType(type).then((blob) => {
    blob.text().then(function (text) {
      if (text.indexOf('<a href') === 0) {
        console.log('Es un enlace html')
        console.log(text)
        console.log(typeof (text))
        processHtmlLink(event, text)
      } else {
        console.log('No hay enlace')
      }
    })
  })
}
async function processHtmlLink (event, text) {
  const raiz = event.target.parentNode.childNodes[1].innerText
  const range = document.createRange()
  range.selectNode(document.body)
  const fragment = range.createContextualFragment(text)
  const a = fragment.querySelector('a')
  const url = a.href
  const nombre = a.innerText
  const escritorio = document.body.getAttribute('data-desk')
  const columna = document.body.getAttribute('data-panel')
  const $raiz = document.querySelector(`[data-db="${raiz}"]`)
  const orden = $raiz.childNodes.length
  console.log(orden)

  const json = {
    idpanel: raiz,
    data: [{
      idpanel: raiz,
      name: nombre,
      URL: url,
      imgURL: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`,
      orden,
      escritorio,
      panel: columna
    }]
  }
  const params = {
    url: '/api/links',
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body: json
  }
  const res = await fetchS(params) // Manejo errores
  console.log(res)
  refreshLinks(res)
}
async function pasteMultipleLinks (array, idpanel) {
  const escritorio = document.body.getAttribute('data-desk')
  const columna = document.body.getAttribute('data-panel')
  const loader = document.getElementById('loadingCard')
  const loaderText = document.querySelector('#loadingCard p')
  loaderText.innerHTML = 'Preparando para copiar ...'
  const progressBar = document.querySelector('.progress-bar')
  loader.style.transform = 'translateX(0)'
  const body = {
    idpanel,
    data: array.map(link => {
      return {
        idpanel,
        escritorio,
        panel: columna,
        URL: link,
        imgURL: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link}&size=64`
      }
    })
  }
  console.log(body)
  const params = {
    url: '/api/links',
    method: 'POST',
    options: {
      contentType: 'application/json'
    },
    body
  }
  const res = await fetchS(params)
  console.log(res)
  loaderText.innerHTML = 'Recibiendo datos ...'
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `${firstKey} ${firstValue}`)
    } else {
      sendMessage(false, `${firstKey} ${firstValue}`)
    }
  } else {
    const porcentajePorPaso = 100 / res.length
    let anchoActual = 0
    res.forEach(link => {
      anchoActual += porcentajePorPaso
      console.log(anchoActual)
      console.log(link.name)
      progressBar.style.width = `${anchoActual}%`
      loaderText.innerHTML = link.name
      refreshLinks(link)
    })
    setTimeout(() => {
      loader.style.transform = 'translateX(375px)'
    }, 500)
    setTimeout(() => {
      progressBar.style.width = '0%'
    }, 1000)
  }
}
/**
 * Función para scrapear el titulo de una pag desde el server
 * @param {*} url
 * @returns
 */
async function getNameByUrl (url) {
  const res = await fetch(`${constants.BASE_URL}/linkName?url=${url}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
  const title = await res.text()
  console.log(title)
  return title
}
/**
 * Función para crear un link y pintarlo de inmediato
 * @param {*} json
 */
function refreshLinks (json) {
  console.log(json.panel)

  // Por cada elemento construimos un link y lo insertamos en su raiz
  let $raiz
  if (!document.body.classList.contains('edit')) {
    $raiz = document.querySelector(`[data-db="${json.idpanel}"]`)
  } else {
    $raiz = document.querySelector(`[data-db="edit${json.idpanel}"]`)
  }

  const $div = document.createElement('div')
  // const loader = document.getElementById('loadingCard')
  // const progressBar = document.querySelector('.progress-bar')
  $div.setAttribute('class', 'link')
  $div.setAttribute('orden', `${json.orden}`)
  $div.setAttribute('id', `${json._id}`)
  const $img = document.createElement('img')
  $img.setAttribute('src', `${json.imgURL}`)
  const $link = document.createElement('a')
  $link.setAttribute('href', `${json.URL}`)
  $link.setAttribute('target', '_blank')
  const $textos = document.createTextNode(`${json.name}`)
  const $description = document.createTextNode(`${json.description}`)
  const $spanName = document.createElement('span')
  const $spanDesc = document.createElement('span')
  $spanName.appendChild($textos)
  $spanDesc.appendChild($description)
  $spanName.setAttribute('class', 'title')
  $spanDesc.setAttribute('class', 'description')
  const $lcontrols = document.createElement('div')
  $lcontrols.setAttribute('class', 'lcontrols')
  let $editControl
  if (document.body.classList.contains('edit')) {
    $editControl = document.createElement('span')
    $editControl.setAttribute('class', 'icofont-external')
  } else {
    $editControl = document.createElement('span')
    $editControl.setAttribute('class', 'icofont-ui-edit showPanel')
  }

  $lcontrols.appendChild($editControl)
  const $expandControl = document.createElement('div')
  $expandControl.setAttribute('class', 'expandControl')
  // Crear el elemento <svg>
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('stroke-width', '1.5')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('class', 'ui-icon-menu')

  // Crear el elemento <path> dentro del <svg>
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('stroke-linecap', 'round')
  path.setAttribute('stroke-linejoin', 'round')
  path.setAttribute('d', 'M19.5 8.25l-7.5 7.5-7.5-7.5')

  // Agregar el elemento <path> al <svg>
  svg.appendChild(path)
  $expandControl.appendChild(svg)
  $link.appendChild($spanName)
  $link.appendChild($spanDesc)

  $div.appendChild($img)
  $div.appendChild($link)
  $div.appendChild($lcontrols)
  if (!document.body.classList.contains('edit')) {
    $div.appendChild($expandControl)
  }

  $raiz.appendChild($div)
  // Borrar el dummy
  if ($raiz.childNodes[0].innerText === '') {
    $raiz.childNodes[0].remove()
  }
  document.querySelectorAll('.borralink').forEach(item => {
    item.removeEventListener('click', toggleDeleteDialogLink)
    item.addEventListener('click', toggleDeleteDialogLink)
  })
  document.querySelectorAll('.editalink').forEach(item => {
    item.removeEventListener('click', toggleDialogEditLink)
    item.addEventListener('click', toggleDialogEditLink)
  })
  document.querySelectorAll('.showPanel').forEach(item => {
    item.removeEventListener('click', togglePanel)
    item.addEventListener('click', togglePanel)
  })
  const carets = document.querySelectorAll('.expandControl')
  carets.forEach(caret => {
    caret.removeEventListener('click', handleLinkHeight)
    caret.addEventListener('click', handleLinkHeight)
  })
  if (document.body.classList.contains('edit')) {
    $div.addEventListener('click', navLinkInfos)
    $editControl.addEventListener('click', (event) => {
      const link = event.target.parentNode.childNodes[1].href
      window.open(link, '_blank')
    })
    const columns = document.querySelectorAll('.tablinks')
    if (columns) {
      columns.forEach(col => {
        if (col.innerText === json.panel) {
          col.click()
        }
      })
    }
    $div.childNodes[1].childNodes[0].click()
    $div.classList.add('navActive')
  }
  // if (loader.style.transform === 'translateX(0px)') {
  //   loader.style.transform = 'translateX(375px)'
  // }
  // if (progressBar.style.width === '100%') {
  //   progressBar.style.width = '0%'
  // }
  $div.addEventListener('contextmenu', mostrarMenu)
}

// funciones auxiliares para mostrar/ocultar cuadros de diálogo

function toggleDialogColumn () {
  const dialog = document.getElementById('addColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogDesktop () {
  const dialog = document.getElementById('addDeskForm')
  const visible = dialog.style.display === 'flex'
  // console.log(visible);
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogEditDesktop (event) {
  const dialog = document.getElementById('editDeskForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogLink (event) {
  const menuL = document.getElementById('menuColumn')
  menuL.style.display = 'none'
  // const panel = event.target.parentNode.parentNode.childNodes[0].innerText
  const panelID = event.target.parentNode.childNodes[1].innerText
  // document.body.setAttribute('data-panel', `${panel}`)
  const boton = document.getElementById('linkSubmit')
  boton.setAttribute('sender', `${panelID}`)
  // console.log(panelID);
  const dialog = document.getElementById('addLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDialogEditLink (event) {
  const menu = document.getElementById('menuLink')
  const menuVisible = menu.style.display === 'flex'
  if (menuVisible) {
    menu.style.display = 'none'
  }
  const url = event.target.parentNode.childNodes[1].innerText
  const linkName = event.target.parentNode.childNodes[2].innerText
  const linkDescription = event.target.parentNode.childNodes[3].innerText
  const panelID = document.body.getAttribute('idpanel')
  const inputName = document.getElementById('editlinkName')
  const inputUrl = document.getElementById('editlinkURL')
  const inputDescription = document.getElementById('editlinkDescription')
  const panel = document.body.getAttribute('data-panel')
  const boton = document.getElementById('editlinkSubmit')

  inputName.value = linkName
  inputUrl.value = url
  inputDescription.value = linkDescription
  boton.setAttribute('sender', `${panelID}`)
  document.body.setAttribute('data-panel', `${panel}`)
  // document.body.setAttribute('data-link', `${linkName}`)

  const dialog = document.getElementById('editLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDeleteDialogLink (event) {
  // nombre panel escritorio id
  console.log(event.target)
  const menu = document.getElementById('menuLink')
  const menuVisible = menu.style.display === 'flex'
  if (menuVisible) {
    menu.style.display = 'none'
  }
  // const nombre = event.target.parentNode.childNodes[2].innerText
  const panelId = document.body.getAttribute('idpanel')
  const panel = document.body.getAttribute('data-panel')
  const boton = document.getElementById('confDeletelinkSubmit')
  boton.setAttribute('sender', `${panelId}`)
  document.body.setAttribute('data-panel', `${panel}`)
  // document.body.setAttribute('data-link', `${nombre}`)
  console.log('Confirmación de Borrado')
  const dialog = document.getElementById('deleteLinkForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDeleteDialogCol (event) {
  const menuL = document.getElementById('menuColumn')
  menuL.style.display = 'none'
  console.log(event.target)
  const id = event.target.parentNode.childNodes[1].innerText
  // const id = event.target.parentNode.parentNode.parentNode.childNodes[1].getAttribute('data-db')
  const boton = document.getElementById('confDeletecolSubmit')
  boton.setAttribute('sender', `${id}`)
  const dialog = document.getElementById('deleteColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function toggleDeleteDialogDesk (event) {
  console.log('Confirmación borrar escritorio')
  const dialog = document.getElementById('deleteDeskForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function escondeDeleteDialog () {
  const dialog = document.getElementById('deleteLinkForm')
  const visible = dialog.style.display === 'flex'
  console.log(visible)
  dialog.style.display = visible ? 'none' : 'flex'
}
function escondeDeleteColDialog () {
  const dialog = document.getElementById('deleteColForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function escondeDeleteDeskDialog () {
  const dialog = document.getElementById('deleteDeskForm')
  const visible = dialog.style.display === 'flex'
  dialog.style.display = visible ? 'none' : 'flex'
}
function escondeDialogos (event) {
  if (window.location.pathname !== '/profile') {
    const cuadros = [
      ...document.querySelectorAll('.deskForm'),
      document.getElementById('addDesk'),
      document.getElementById('addCol'),
      document.getElementById('editDesk'),
      document.getElementById('removeDesk'),
      document.getElementById('menuMoveTo'),
      document.getElementById('otherDesk'),
      document.getElementById('menuLink'),
      document.getElementById('menuColumn'),
      ...document.querySelectorAll('.addlink'),
      ...document.querySelectorAll('.icofont-close-line'),
      ...document.querySelectorAll('.editalink'),
      ...document.querySelectorAll('.borralink'),
      ...document.querySelectorAll('.borracol')
    ]

    cuadros.forEach(element => {
      element.addEventListener('click', (event) => {
        event.stopPropagation()
      })

      const visible = element.style.display === 'flex' || element.style.display === 'block'
      if (visible && !cuadros.includes(event.target)) {
        element.style.display = 'none'
      }
    })
  }
}

// Funciones para aplicar Sortablejs

function ordenaItems (panels) {
  if (panels !== null && panels !== undefined) {
    const escritorioActual = document.body.getAttribute('data-desk')
    const el = panels.map(panel => (
      document.getElementById(`${panel.childNodes[1].id}`)
    ))
    el.forEach(element => {
      const grupo = `Shared${escritorioActual}`
      // eslint-disable-next-line no-undef, no-unused-vars
      const sortableList = Sortable.create(element, {
        group: grupo,
        filter: '.envolt',
        options: {
          sort: false,
          dataIdAttr: 'data-id'
        },
        // Al terminar de arrastrar el elemento, decidimos que hacer dependiendo de si
        // se ha arrastrado en la misma columna o a una distinta
        onEnd: async function (evt) {
          const itemEl = evt.item
          const id = itemEl.id
          const listaOrigen = evt.from
          const listaDestino = evt.to
          const idpanel = listaDestino.attributes[2].nodeValue
          const idpanelOrigen = listaOrigen.attributes[2].nodeValue
          const escritorio = document.body.getAttribute('data-desk')
          const panel = itemEl.parentNode.parentNode.childNodes[0].innerText
          const nombre = itemEl.childNodes[1].childNodes[0].innerText

          // Si el elemento arrastrado es el último crea un elemento link vacio
          if (document.querySelector(`[data-db="${idpanelOrigen}"]`).childNodes.length === 0) {
            const $raizOld = document.querySelector(`[data-db="${idpanelOrigen}"]`)
            const $div = document.createElement('div')
            $div.setAttribute('class', 'link')
            $raizOld.appendChild($div)
          }
          // Si el elemento se vuelve a arrastrar a una columna con dummy eliminar el dummy
          if (document.querySelector(`[data-db="${idpanel}"]`).childNodes.length === 2) {
            const $raizNew = document.querySelector(`[data-db="${idpanel}"]`)
            const hijos = $raizNew.children
            for (let i = 0; i < hijos.length; i++) {
              const hijo = hijos[i]
              if (!hijo.innerText) {
                // El elemento hijo no tiene innerText
                $raizNew.removeChild(hijo)
              }
            }
          }
          const orden = document.querySelector(`[data-db="${idpanel}"]`).childNodes.length
          const destinyElements = document.querySelectorAll(`[data-db="${idpanel}"]`)[0].childNodes
          const destinyIds = []
          destinyElements.forEach(element => {
            destinyIds.push(element.id)
          })
          const originElements = document.querySelectorAll(`[data-db="${idpanelOrigen}"]`)[0].childNodes
          const originIds = []
          if (originElements.length > 1) {
            originElements.forEach(element => {
              originIds.push(element.id)
            })
          }
          // Try catch o fetchS
          if (idpanel === idpanelOrigen) {
            console.log('coinciden')
            let body = { id, destinyIds, fields: { escritorio, name: nombre, idpanel, panel, orden } }
            body = JSON.stringify(body)
            const res = await fetch(`${constants.BASE_URL}/links`, {
              method: 'PATCH',
              headers: {
                'content-type': 'application/json'
              },
              body
            })
            const json = await res.json()
            console.log(json)
          } else {
            let body = { id, idpanelOrigen, destinyIds, originIds, fields: { escritorio, name: nombre, idpanel, panel, orden } }
            body = JSON.stringify(body)
            const res = await fetch(`${constants.BASE_URL}/links`, {
              method: 'PATCH',
              headers: {
                'content-type': 'application/json'
              },
              body
            })
            const json = await res.json()
            console.log(json)
          }
        }
      })
    })
  } else {
    sendMessage(false, 'Error al recuperar los paneles, las funciones de ordenar los links mediante drag&drop no estan disponibles, contacta con el servicio técnico')
  }
}
function ordenaCols (element) {
  // eslint-disable-next-line no-undef
  Sortable.create(element, {
    group: `Grupo${element.id}`,
    sort: false,
    dataIdAttr: 'data-id',
    onEnd: async function (evt) {
      const itemEl = evt.item
      console.log(itemEl)
      const escritorio = document.body.getAttribute('data-desk')
      const elements = document.getElementById(`${escritorio}Cols`).childNodes
      console.log(elements)
      // Esto no parece estar funcionando pero al final devuelve el orden actual de los elementos y eso es correcto
      const sortedElements = Array.from(elements).sort((a, b) => {
        return a.dataset.orden - b.dataset.orden
      })
      console.log(sortedElements)
      const names = []
      sortedElements.forEach(element => {
        names.push(element.childNodes[1].dataset.db)
      })
      const sortedNames = sortedElements.map(elem => (
        elem.childNodes[0].innerText
      ))
      sortSideInfo(sortedNames)
      console.log(sortedNames)
      console.log(names)
      let body = names
      body = JSON.stringify({ body })
      const res = await fetch(`${constants.BASE_URL}/dragcol?escritorio=${escritorio}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body
      })
      const json = await res.json()
      console.log(json)
    }
  })
}
function ordenaDesks () {
  // eslint-disable-next-line no-undef
  Sortable.create(drpEscritorios, {
    onEnd: async function (evt) {
      console.log('Lo has movido')
      // Simplemente enviar el orden actual y hacer una función que ordene en el back, pasar los nombres en el orden actual
      const elements = Array.from(document.querySelectorAll('a.deskList'))
      console.log(elements)
      const names = []
      elements.forEach(element => {
        names.push(element.innerText)
      })
      console.log(names)
      let body = names
      body = JSON.stringify(body)
      const res = await fetch(`${constants.BASE_URL}/ordenaDesks`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body
      })
      const json = await res.json()
      console.log(json)
    }
  })
}
// Funcion logout

function logOut () {
  console.log('Cierra sesión')
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  window.location = '/'
}
// Funcion ir a perfil
function profile () {
  console.log('Has hecho click')
  window.location = '/profile'
}
// handleShowContextMenu y dividir en dos cols y links
export function mostrarMenu (event) {
  event.preventDefault()
  const forms = [...document.querySelectorAll('.deskForm'), document.getElementById('menuMoveTo')]
  forms.forEach(form => {
    if (form.style.display === 'flex' || form.style.display === 'block') {
      form.style.display = 'none'
    }
  })
  // Detectar si se hizo clic con el botón derecho del ratón
  if (event.button === 2) {
    if (event.currentTarget.classList.contains('headercolumn') || event.currentTarget.classList.contains('tablinks')) {
      // Primero ocultamos el menu link, si está visible
      const menuL = document.getElementById('menuLink')
      if (menuL.style.display === 'flex') {
        menuL.style.display = 'none'
      }
      // Obtener la información del elemento en el que se hizo clic
      const elemento = event.currentTarget
      console.log(elemento)
      const editMode = document.body.classList.contains('edit')
      const colId = editMode
        ? elemento.dataset.db
        : elemento.parentNode.childNodes[1].dataset.db
      const botonConfBorrar = document.getElementById('confDeletecolSubmit')
      botonConfBorrar.setAttribute('sender', colId)
      console.log(colId)
      // Actualizar el contenido del menú emergente con la información relevante
      const informacion = elemento.textContent
      const info = document.getElementById('infoC')
      info.textContent = informacion
      document.body.setAttribute('data-panel', informacion.trim())

      // Actualizar el contenido del menú emergente con la información relevante
      const contenidoMenu = document.getElementById('elementoC')
      contenidoMenu.textContent = colId
      // Luego mostramos el menu columna
      const menu = document.getElementById('menuColumn')
      // Obtener la posición del ratón
      const posX = event.clientX
      const posY = event.clientY
      console.log('🚀 ~ file: scripts3.js:1840 ~ event.target.classList.contains ~ posY:', posY)
      // Posicionar el menú emergente cerca de la posición del ratón
      menu.style.left = posX + 'px'
      menu.style.top = posY + 'px'
      menu.style.display = 'flex'
    }
    if (event.currentTarget.classList.contains('link')) {
      const elemento = event.currentTarget
      document.body.setAttribute('data-link', elemento.id)
      // Primero ocultamos el menu columna si esta visible
      const menuC = document.getElementById('menuColumn')
      if (menuC.style.display === 'flex') {
        menuC.style.display = 'none'
      }
      if (!document.body.classList.contains('edit')) {
        // if elemnto padre es el contenedor de resultados, buscar el idpanel de otra forma
        if (elemento.parentNode.id === 'resultsContainer') {
          const idPanel = elemento.childNodes[5].innerText.replace('idpanel: ', '')
          const panel = elemento.childNodes[3].innerText.replace('Panel: ', '')
          document.body.setAttribute('idPanel', idPanel)
          document.body.setAttribute('data-panel', panel)
        } else {
          document.body.setAttribute('idPanel', elemento.parentNode.dataset.db)
          document.body.setAttribute('data-panel', elemento.parentNode.parentNode.childNodes[0].innerText)
        }
        const idpanel = document.body.getAttribute('idpanel')
        const menuItems = document.querySelectorAll('#destCol li')
        menuItems.forEach(item => {
          if (item.dataset.db === idpanel) {
            item.style.display = 'none'
          } else {
            item.style.display = 'block'
          }
        })
        const informacion = elemento.childNodes[1].childNodes[0].textContent
        const infoDesc = elemento.childNodes[1].childNodes[1].textContent
        const info = document.getElementById('infoL')
        const infoDescHolder = document.getElementById('infoD')
        info.textContent = informacion
        infoDescHolder.textContent = infoDesc
        // Actualizar el contenido del menú emergente con la información relevante
        const contenidoMenu = document.getElementById('elementoL')
        contenidoMenu.textContent = elemento.childNodes[1].href
      } else {
        // quitar el edit del id en edit
        let id = elemento.parentNode.dataset.db
        id = id.replace(/edit/g, '')
        document.body.setAttribute('idPanel', id)
        let nombreCol = elemento.parentNode.id
        const desk = document.body.getAttribute('data-desk')
        nombreCol = nombreCol.replace(new RegExp(desk, 'g'), '')
        document.body.setAttribute('data-panel', nombreCol)
        // Puede que a partir de aqui este bien
        const informacion = elemento.childNodes[1].childNodes[0].textContent
        const infoDesc = elemento.childNodes[1].childNodes[1].textContent
        const info = document.getElementById('infoL')
        const infoDescHolder = document.getElementById('infoD')
        info.textContent = informacion
        infoDescHolder.textContent = infoDesc
        // Actualizar el contenido del menú emergente con la información relevante
        const contenidoMenu = document.getElementById('elementoL')
        contenidoMenu.textContent = elemento.childNodes[1].href
      }
      // Mostramos el menu
      const menu = document.getElementById('menuLink')
      // Obtener la posición del ratón
      const posX = event.clientX
      const posY = event.clientY
      // Posicionar el menú emergente cerca de la posición del ratón
      menu.style.left = posX + 'px'
      menu.style.top = posY + 'px'
      menu.style.display = 'flex'
    }
  }
}
function handleOtherDeskMove (event) {
  const menuL = document.getElementById('menuLink')
  menuL.style.display = 'none'
  console.log(event.target.parentNode.parentNode.parentNode.childNodes[2].innerText)
  document.body.setAttribute('dataLink', event.target.parentNode.parentNode.parentNode.childNodes[2].innerText)
  const menu = document.getElementById('menuMoveTo')
  if (menu.style.display === 'none' || menu.style.display === '') {
    menu.style.display = 'block'
  } else {
    menu.style.display = 'none'
  }
}
function selectDestination (event) {
  console.log(event.target.parentNode.parentNode.id)
  document.body.setAttribute('destination-desk', event.target.parentNode.parentNode.id)
  const destinations = document.querySelectorAll('li.accordion ul li')
  destinations.forEach(destination => {
    if (destination === event.target) {
      destination.style.backgroundColor = '#ccc'
      destination.classList.add('selected')
    } else {
      destination.style.backgroundColor = ''
      destination.classList.remove('selected')
    }
  })
  const acceptButton = document.getElementById('acceptMove')
  acceptButton.removeEventListener('click', handleSubmitMove)
  acceptButton.addEventListener('click', handleSubmitMove)
}
async function handleSubmitMove () {
  const destination = document.querySelector('li.accordion ul li.selected')
  const idpanelOrigen = document.body.getAttribute('idpanel')
  const panel = destination.id
  const escritorio = document.body.getAttribute('destination-desk')

  const res = await fetch(`${constants.BASE_URL}/columnas?escritorio=${escritorio}`, {
    method: 'GET',
    headers: {
      contentType: 'application/json'
    }
  })
  const data = await res.json()
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]

  if (firstKey === 'error') {
    sendMessage(false, `Error: ${firstKey}, ${firstValue}`)
    return
  } else {
    let idpanel
    const linkName = document.body.getAttribute('dataLink')
    data.forEach(col => {
      if (col.name === panel) {
        idpanel = col._id
      }
    })
    let orden = document.querySelector(`[data-db="${idpanelOrigen}"]`)
    if (orden) {
      orden = orden.childNodes.length
    } else {
      // TODO
      orden = 0
    }
    console.log(orden)
    const id = document.body.getAttribute('data-link')
    const body = { id, idpanelOrigen, fields: { idpanel, panel, name: linkName, orden, escritorio } }
    console.log(body)
    const params = {
      url: `${constants.BASE_URL}/links`,
      method: 'PATCH',
      options: {
        contentType: 'application/json'
      },
      body
    }
    const res = await fetchS(params)
    console.log('Resultado del servidor')
    console.log(res)
    // Recogemos los links para detectar el movido y eliminarlo
    const links = document.querySelectorAll('div.link')
    if (links) {
      links.forEach(element => {
        // problema con duplicados, meter id de base de datos como id de elemento
        if (element.id === res._id) {
          console.log('Hay coincidencia con el enviado del servidor')
          console.log(element.id)
          console.log(res._id)
          // Hacer algo con el elemento encontrado
          element.remove()
        }
      })
    }
    const menu = document.getElementById('menuMoveTo')
    if (menu.style.display === 'none' || menu.style.display === '') {
      menu.style.display = 'block'
    } else {
      menu.style.display = 'none'
    }
  }
  sendMessage(true, 'Link Movido!')
}
function setLastVisited (event) {
  const links = document.querySelectorAll('div.link')
  links.forEach(link => {
    if (link.classList.contains('lastVisited')) {
      link.classList.remove('lastVisited')
    }
  })
  if (!document.body.classList.contains('edit')) {
    console.log(event.target.parentNode.parentNode)
    const lastVisited = event.target.parentNode.parentNode
    lastVisited.classList.add('lastVisited')
  }
}
function scrollToTop () {
  window.scroll(top)
}
function toggleBotonSubirArriba () {
  const btnSubirArriba = document.getElementById('btnSubirArriba')
  // const contenedor = document.querySelectorAll('.container')[0]
  if (window.scrollY > 20) {
    btnSubirArriba.style.opacity = 1
    btnSubirArriba.style.visibility = 'visible'
  } else {
    btnSubirArriba.style.opacity = 0
    btnSubirArriba.style.visibility = 'hidden'
  }
}
function hidePanels () {
  const panels = document.querySelector('.cuerpoInt')
  panels.classList.toggle('visiblePanels')
}

// async function testImages () {
//   const links = document.querySelectorAll('.link')
//   links.forEach(async link => {
//     const res = await fetch(`/api/linkStatus?url=${link.childNodes[0].src}`)
//     if (!res.ok) {
//       console.log('Error al recuperar datos')
//     }
//     const data = await res.json()
//     const { status } = data
//     console.log(status)
//     if (status === 'clientErr' || status === 'serverErr') {
//       link.childNodes[0].src = 'img/opcion4.svg'
//     }
//   })
// }
