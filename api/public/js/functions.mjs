import { editColumn } from './scripts3.js'

export const constants = {
  BASE_URL: '/api',
  BACKGROUNDS_URL: '/img/'
}

function hora () {
  const fecha = new Date()
  const hora = fecha.getHours()
  const min = fecha.getMinutes()
  const posicion = document.getElementById('reloj')

  if (hora < 10 && min < 10) {
    posicion.innerHTML = '0' + hora + ':' + '0' + min
  } else if (min < 10 && hora >= 10) {
    posicion.innerHTML = hora + ':' + '0' + min
  } else if (hora < 10 && min >= 10) {
    posicion.innerHTML = '0' + hora + ':' + min
  } else {
    posicion.innerHTML = hora + ':' + min
  }
}
export function formatPath (path) {
  const decodedPath = decodeURIComponent(path)
  const formattedPath = decodedPath.replace(/\s+/g, '-').toLowerCase()
  console.log('🚀 ~ file: formatUrl.js:6 ~ formatUrl ~ formattedUrl:', formattedPath)
  const normalizedPath = formattedPath.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return normalizedPath
}
export function darHora () {
  hora()
  setInterval(hora, 60000)
}

export async function fetchS (params) {
  let { url, method, options } = params
  let { body } = params
  if (options.query !== undefined) {
    // console.log(`${url}${options.query}`)
    url = `${url}${options.query}`
    body = { body }
  }
  body = JSON.stringify(body)
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'content-type': options.contentType
      },
      body
    })
    if (!response.ok) {
      // throw new Error('Error en la solicitud: ' + response.status)
      const data = await response.json()
      return data
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    // Manejar el error
    console.error('Error en la solicitud:', error)
    return ('Error en la solicitud:', error)
  }
}
export function formatDate (date) {
  const fecha = new Date(date)

  const opcionesFecha = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const opcionesHora = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }

  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha)
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora)

  const resultado = fechaFormateada + ' ' + horaFormateada
  // console.log(resultado)
  return resultado
}

export function sendMessage (success, message) {
  const card = document.getElementById('alertCard')
  if (!success) {
    card.style.borderLeftColor = 'red'
  } else {
    card.style.borderLeftColor = 'mediumseagreen'
  }
  card.innerText = message
  // Realizar la transformación inicial
  card.style.transform = 'translateX(0px)'

  // Después de 2 segundos, volver a la posición inicial
  setTimeout(() => {
    card.style.transform = 'translateX(335px)'
  }, 4000)
}

export function handleDbClick () {
  let tiempoUltimoClick = 0
  let ultimoElementoDblClick = null
  document.addEventListener('click', function (event) {
    const tiempoActual = new Date().getTime()
    if (tiempoActual - tiempoUltimoClick < 300) {
      // console.log('Doble Click')
      // Si el elemento target es H2
      // Poner editable a true
      // llamar a subrayar con los args del target
      // Poner en el body el nombre para comprobar si cambia
      if (event.target.nodeName === 'H2') {
        ultimoElementoDblClick = event.target
        document.body.setAttribute('data-panel', `${event.target.innerText.trim()}`)
        selectText(ultimoElementoDblClick)
        ultimoElementoDblClick.setAttribute('contenteditable', 'true')
        ultimoElementoDblClick.focus()
      }
    }
    tiempoUltimoClick = tiempoActual
  })
}
/**
 * Función que cambia el nombre de una columna o no dependiendo de si ha cambiado y se ha hecho click fuera de ella o se ha presionado la tecla enter
 */
export function handleSimpleClick () {
  document.addEventListener('click', function (event) {
    // console.log('Simple Click')
    const element = document.querySelector('h2[contenteditable="true"]') || document.querySelector('button[contenteditable="true"]')
    const buttonMenu = document.querySelector('.editcol')
    // console.log(element.nodeName)
    // console.log(event.target)
    // Si el elemento no es EL H2 que esta con editable a true o el menu contextual
    // Poner editable a false y comprobar si ha cambiado -> Como? cons. el body
    // llamar a envio o sea editColumn(name, desk, idpanel)
    if (element && event.target !== element && event.target !== buttonMenu) {
      if (element.innerText === '') {
        element.innerText = document.body.getAttribute('data-panel')
      }
      element.setAttribute('contenteditable', 'false')
      // console.log(element.innerText)
      // console.log(element.parentNode.parentNode.childNodes[1].dataset.db)
      if (element.innerText !== document.body.getAttribute('data-panel')) {
        // console.log('Ha cambiado')
        const name = element.innerText.trim()
        const desk = document.body.getAttribute('data-desk')
        let idPanel
        if (element.nodeName === 'H2') {
          idPanel = element.parentNode.parentNode.childNodes[1].dataset.db
        } else {
          idPanel = element.dataset.db
        }

        editColumn(name, desk, idPanel)
      }
    }
  })
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.target.nodeName === 'H2') {
      event.preventDefault() // Evitar el comportamiento predeterminado de la tecla Enter (por ejemplo, agregar un salto de línea)
      const element = document.querySelector('h2[contenteditable="true"]') || document.querySelector('button[contenteditable="true"]')
      if (element.innerText === '') {
        element.innerText = document.body.getAttribute('data-panel')
      }
      element.setAttribute('contenteditable', 'false')
      // console.log('Se ha presionado la tecla Enter')
      if (element.innerText !== document.body.getAttribute('data-panel')) {
        // console.log('Ha cambiado')
        const name = element.innerText.trim()
        const desk = document.body.getAttribute('data-desk')
        let idPanel
        if (element.nodeName === 'H2') {
          idPanel = element.parentNode.parentNode.childNodes[1].dataset.db
        } else {
          idPanel = element.dataset.db
        }
        editColumn(name, desk, idPanel)
      }
    }
  })
}
export function preEditColumn (event) {
  // console.log('Click contextual')
  // Poner editable a true
  // llamar a subrayar con los args del target
  // Poner en el body el nombre para comprobar si cambia
  const menuL = document.getElementById('menuColumn')
  menuL.style.display = 'none'
  const idPanel = event.target.parentNode.childNodes[1].innerText
  // console.log(idPanel)
  const son = document.querySelector(`[data-db="${idPanel}"]`)
  // console.log(son.nodeName)
  let element
  if (son.nodeName === 'BUTTON') {
    element = son
  } else {
    element = son.parentNode.childNodes[0].childNodes[0]
  }
  // console.log(element)
  selectText(element)
  element.setAttribute('contenteditable', 'true')
  element.focus()
}

function selectText (element) {
  const range = document.createRange()
  range.selectNodeContents(element)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

export const videoUrlsObj = {
  Youtube: {
    url: 'https://www.youtube.com/watch',
    embedURL: 'https://www.youtube.com/embed/',
    extractParam: function (url) {
      return url.split('=')[1]
    }
  },
  Pornhub: {
    url: 'https://es.pornhub.com/view_video',
    embedURL: 'https://www.pornhub.com/embed/',
    extractParam: function (url) {
      return url.split('=')[1]
    }
  },
  Xvideos: {
    url: 'https://www.xvideos.com/video',
    embedURL: 'https://www.xvideos.com/embedframe/',
    extractParam: function (url) {
      const regex = /video(\d+)/i
      const match = url.match(regex)
      if (match && match[1]) {
        return match[1]
      }
    }
  }
}
export function checkUrlMatch (url) {
  for (const key in videoUrlsObj) {
    if (Object.prototype.hasOwnProperty.call(videoUrlsObj, key)) {
      const videoUrl = videoUrlsObj[key]
      if (url.includes(videoUrl.url)) {
        const extractedParam = videoUrl.extractParam(url)
        return videoUrl.embedURL + extractedParam
      }
    }
  }
  return null // Si no hay coincidencia
}
export function getCookieValue (cookieName) {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()

    if (cookie.startsWith(cookieName + '=')) {
      return cookie.substring(cookieName.length + 1)
    }
  }

  return null // Si no se encuentra la cookie
}
export function openTab (event) {
  // console.log(event.target.attributes[2].value)
  const tabName = event.target.attributes[2].value
  let i
  const tabcontent = document.getElementsByClassName('tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none'
  }
  const tablinks = document.getElementsByClassName('tablinks')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '')
  }
  document.querySelector(`.tabcontent[orden="${tabName}"]`).style.display = 'grid'
  event.currentTarget.className += ' active'
}
