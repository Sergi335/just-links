import { formatDate, sendMessage, checkUrlMatch } from './functions.mjs'
document.addEventListener('DOMContentLoaded', sidePanel)

function sidePanel () {
  if (window.location.pathname !== '/profile') addPanelEvents()
  const element = document.querySelectorAll('div.link')[0]
  console.log('🚀 ~ file: sidepanel.js:7 ~ sidePanel ~ element:', element)
  if (element && element !== null) {
    element.classList.add('navActive')
    // Esto es para edit view
    if (document.body.classList.contains('edit')) {
      showLinkInfo(element)
    }
  }
}
function addPanelEvents () {
  document.querySelectorAll('.showPanel').forEach(item => {
    item.removeEventListener('click', togglePanel)
    item.addEventListener('click', togglePanel)
  })
  document.getElementById('linkNotes').removeEventListener('click', handleNotes)
  document.getElementById('linkNotes').addEventListener('click', handleNotes)
  document.getElementById('linkNotes').removeEventListener('keydown', handleNotes)
  document.getElementById('linkNotes').addEventListener('keydown', handleNotes)
  document.getElementById('sendNotes').removeEventListener('click', sendNotes)
  document.getElementById('sendNotes').addEventListener('click', sendNotes)
  document.getElementById('pasteImg').removeEventListener('click', pasteImg)
  document.getElementById('pasteImg').addEventListener('click', pasteImg)
  document.getElementById('linkNotes').addEventListener('paste', function (event) {
    // event.preventDefault() // Evita la acción de pegar predeterminada del navegador

    const clipboardData = event.clipboardData || window.Clipboard
    const pastedText = clipboardData.getData('text/html')
    console.log(pastedText)
  })
  document.getElementById('confDeleteImgSubmit').removeEventListener('click', deleteImage)
  document.getElementById('confDeleteImgSubmit').addEventListener('click', deleteImage)
  document.getElementById('noDeleteImgSubmit').removeEventListener('click', closeConfDeleteImage)
  document.getElementById('noDeleteImgSubmit').addEventListener('click', closeConfDeleteImage)
  document.querySelector('.icofont-delete-alt').addEventListener('click', function textFormat () {
    console.log('Borramos texto')
    const notesDiv = document.getElementById('linkNotes')
    notesDiv.innerHTML = 'Escribe aquí ...'
  })
  document.querySelector('.icofont-delete-alt').addEventListener('mousedown', function () {
    document.querySelector('.icofont-delete-alt').classList.add('textContActive')
  })
  document.querySelector('.icofont-delete-alt').addEventListener('mouseup', function () {
    document.querySelector('.icofont-delete-alt').classList.remove('textContActive')
  })
  document.querySelector('#limage').addEventListener('click', function () {
    if (document.querySelector('#imgOptions').classList.contains('slide-in-left')) {
      document.querySelector('#imgOptions').classList.remove('slide-in-left')
    } else {
      document.querySelector('#imgOptions').classList.add('slide-in-left')
    }
  })
  document.querySelectorAll('#imgOptions img').forEach(item => {
    item.addEventListener('click', changeLinkImg)
  })
  const opt8 = document.getElementById('option8')
  opt8.removeEventListener('click', changeLinkImg)
  opt8.addEventListener('click', changeLinkImg)

  document.querySelector('#upLinkImg').addEventListener('change', changeLinkImg)
  document.querySelector('#saveLinkImage').removeEventListener('click', fetchLinkImage)
  document.querySelector('#saveLinkImage').addEventListener('click', fetchLinkImage)
  if (!document.body.classList.contains('edit')) {
    const panelCloser = document.getElementById('sideClose')
    panelCloser.removeEventListener('click', closePanel)
    panelCloser.addEventListener('click', closePanel)
  }

  const nextLink = document.getElementById('next')
  nextLink.removeEventListener('click', navLinkInfos)
  nextLink.addEventListener('click', navLinkInfos)
  const prevLink = document.getElementById('prev')
  prevLink.removeEventListener('click', navLinkInfos)
  prevLink.addEventListener('click', navLinkInfos)
  if (document.body.classList.contains('edit')) {
    const links = document.querySelectorAll('div.link')
    links.forEach(link => {
      link.removeEventListener('click', navLinkInfos)
      link.addEventListener('click', navLinkInfos)
    })
  }
}
function closePanel () {
  const panel = document.getElementById('sidepanel')
  const masonry = document.getElementById('imgMasonry')
  const videoFrame = document.getElementById('videoFrame')
  const loader = document.getElementById('liLoader')

  panel.style.display = 'none'
  // document.documentElement.style.overflow = 'auto'
  masonry.style.backgroundImage = 'var(--placeholderImg)'
  videoFrame.src = ''
  masonry.innerHTML = ''
  loader.classList.remove('fade-off')
}
export function togglePanel (event) {
  const element = event.target.parentNode.parentNode
  showLinkInfo(element)
  const panel = document.getElementById('sidepanel')
  const links = document.querySelectorAll('div.link')
  const buttonNext = document.getElementById('next')
  const buttonPrev = document.getElementById('prev')
  const linksIds = []
  links.forEach(item => {
    linksIds.push(item.id)
  })
  const actualPos = linksIds.indexOf(event.target.parentNode.parentNode.id)

  actualPos > 0 ? buttonPrev.disabled = false : buttonPrev.disabled = true
  actualPos === linksIds.length - 1 ? buttonNext.disabled = true : buttonNext.disabled = false

  panel.style.display = 'flex'
}
export function navLinkInfos (event) {
  event.preventDefault()
  const loader = document.getElementById('liLoader')
  loader.classList.remove('fade-off')
  const masonry = document.getElementById('imgMasonry')
  masonry.style.display = 'block'
  const videoFrame = document.getElementById('videoFrame')
  masonry.innerHTML = ''
  videoFrame.src = ''

  const idHolder = document.getElementById('linkId')
  const links = document.querySelectorAll('div.link')
  const linksIds = []
  links.forEach(item => {
    linksIds.push(item.id)
  })
  const panels = document.querySelectorAll('.tablinks')
  const panelsNames = []
  panels.forEach(panel => {
    panelsNames.push(panel.innerText)
  })
  const buttonNext = document.getElementById('next')
  const buttonPrev = document.getElementById('prev')
  let actualPos = linksIds.indexOf(idHolder.innerText)
  // Navegación directa al clicar enlace en edit mode
  if (event.target.nodeName === 'SPAN') {
    const element = event.target.parentNode.parentNode
    showLinkInfo(element)
    links.forEach(link => {
      if (link.classList.contains('navActive')) link.classList.remove('navActive')
    })
    element.classList.add('navActive')
    buttonPrev.disabled = false
  }
  // Navegación alante y atrás con los botones
  if (event.target.id === 'prev') {
    actualPos = actualPos - 1
    buttonNext.disabled = false
    if (actualPos === 0) buttonPrev.disabled = true
    const element = document.getElementById(linksIds[actualPos])
    showLinkInfo(element)
    if (element.nextElementSibling) element.nextElementSibling.classList.remove('navActive')
    element.classList.add('navActive')
    const panel = element.parentNode.id
    const buttons = document.querySelectorAll('button.tablinks')
    for (const button of buttons) {
      if (button.id === panel) {
        button.click()
        break // Rompe el bucle una vez que se encuentra el botón deseado
      }
    }
  }
  if (event.target.id === 'next') {
    actualPos = actualPos + 1
    if (actualPos === linksIds.length - 1) buttonNext.disabled = true
    buttonPrev.disabled = false
    const element = document.getElementById(linksIds[actualPos])
    if (element.previousElementSibling) {
      element.previousElementSibling.classList.remove('navActive')
    }
    element.classList.add('navActive')
    showLinkInfo(element)
    const panel = element.parentNode.id
    const buttons = document.querySelectorAll('button.tablinks')
    for (const button of buttons) {
      if (button.id === panel) {
        button.click()
        break // Rompe el bucle una vez que se encuentra el botón deseado
      }
    }
  }
}
async function showLinkInfo (element) {
  const loader = document.getElementById('liLoader')
  const imagesHolder = document.getElementById('linkImages')
  try {
    const id = element.id
    const imgUrl = element.childNodes[0].src
    const nombre = element.childNodes[1].childNodes[0].innerHTML
    let panel

    if (!document.body.classList.contains('edit')) {
      panel = element.parentNode.parentNode.childNodes[0].innerText
    } else {
      const desk = document.body.getAttribute('data-desk')
      panel = element.parentNode.id
      const index = panel.indexOf(desk)
      if (index !== -1) {
        panel = panel.slice(0, index) + panel.slice(index).replace(desk, '')
      }
    }

    const res = await fetch(`/api/links/id/${id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    const json = await res.json()
    console.log(json)
    const notas = json.notes
    const images = json.images

    const idHolder = document.getElementById('linkId')
    idHolder.innerText = id

    const imageHolder = document.getElementById('limage')
    imageHolder.src = imgUrl

    const nameHolder = document.getElementById('lname')
    nameHolder.innerText = nombre

    const descHolder = document.getElementById('ldesc')
    descHolder.innerText = json.description

    const panelHolder = document.getElementById('lpanel')
    panelHolder.innerText = panel

    const urlHolder = document.getElementById('lurl')
    const url = element.childNodes[1].href
    urlHolder.href = url
    urlHolder.innerText = url
    getUrlStatus(url)
    const dateHolder = document.getElementById('ladded')
    dateHolder.innerText = formatDate(json.createdAt)

    const notesDiv = document.getElementById('linkNotes')
    notesDiv.innerHTML = notas === undefined || notas === '' ? 'Escribe aquí ...' : notas

    if (images !== undefined && images.length > 0) {
      const videoFrame = document.getElementById('videoFrame')
      videoFrame.style.display = 'none'
      const masonry = document.getElementById('imgMasonry')
      masonry.style.backgroundImage = "url('')"

      images.forEach(img => {
        const image = document.createElement('img')
        image.src = img
        const id = img.match(/(\d+-\d+)/)[1]
        image.id = id

        const anchor = document.createElement('a')
        const closer = document.createElement('i')
        closer.classList.add('icofont-close-line')

        anchor.appendChild(image)
        anchor.appendChild(closer)
        masonry.appendChild(anchor)
      })

      document.querySelectorAll('.icofont-close-line').forEach(item => {
        item.addEventListener('click', confDeleteImage)
      })

      document.querySelectorAll('#imgMasonry a').forEach(item => {
        item.addEventListener('click', openModal)
      })
      makeMasonry()
    } else {
      const masonry = document.getElementById('imgMasonry')
      masonry.style.backgroundImage = 'var(--placeholderImg)'
    }
    const videoFrame = document.getElementById('videoFrame')
    const frameWrapper = document.getElementById('frameWrapper')
    const matchedUrl = checkUrlMatch(url)
    if (matchedUrl) {
      frameWrapper.style.backgroundImage = "url('')"
      videoFrame.style.display = 'block'
      videoFrame.src = matchedUrl
    } else {
      videoFrame.style.display = 'none'
      frameWrapper.style.backgroundImage = 'var(--placeholderVid)'
    }

    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-off')
        imagesHolder.style.overflowY = 'auto'
      }
    }, 1000)
  } catch (error) {
    console.error(error)
    sendMessage(false, 'Error al recuperar link info')
    loader.classList.add('fade-off')
    imagesHolder.style.overflowY = 'auto'
    // ojo que pasa aqui
  }
}

async function handleNotes (event) {
  const notesDiv = document.getElementById('linkNotes')
  if (notesDiv.innerText === 'Escribe aquí ...') {
    notesDiv.innerText = ''
  }
  if (event.key === 'Enter') {
    // Evitar el comportamiento predeterminado de la tecla Enter
    event.preventDefault()

    // Insertar una nueva línea manualmente
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const br = document.createElement('br')
    const textNode = document.createTextNode('\u00a0') // Agregar un espacio en blanco
    range.deleteContents()
    range.insertNode(br)
    range.collapse(false)
    range.insertNode(textNode)
    range.selectNodeContents(textNode)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
async function sendNotes (event) {
  const id = document.getElementById('linkId').innerText
  console.log(event.target.parentNode.childNodes)
  console.log(id)
  const notesDiv = document.getElementById('linkNotes')
  const notes = notesDiv.innerHTML
  let body = { id, fields: { notes } }
  body = JSON.stringify(body)
  console.log(body)
  const res = await fetch('/api/links', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()
  console.log(json)
  const firstKey = Object.keys(json)[0]
  const firstValue = json[firstKey]

  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
    } else {
      sendMessage(false, `${firstKey}, ${firstValue}`)
    }
  } else {
    sendMessage(true, 'Notas guardadas')
  }
}
function pasteImg () {
  navigator.clipboard.read().then((clipboardItems) => {
    for (const clipboardItem of clipboardItems) {
      console.log(clipboardItems)
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          // es una imagen
          clipboardItem.getType(type).then((blob) => {
            console.log('Imagen:', blob)
            const imageUrl = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            const closer = document.createElement('i')
            closer.setAttribute('class', 'icofont-close-line')
            const $img = document.createElement('img')
            $img.setAttribute('src', imageUrl)
            anchor.appendChild($img)
            anchor.appendChild(closer)
            // Establecer la URL de datos como el src de la imagen
            document.getElementById('linkImages').style.backgroundImage = 'none'
            document.getElementById('imgMasonry').appendChild(anchor)
            anchor.addEventListener('click', openModal)
            closer.addEventListener('click', confDeleteImage)
            document.getElementById('imgMasonry').style.display = 'block'
            fetchImage()
            makeMasonry()
          })
        }
      }
    }
  })
}
async function changeLinkImg (event) {
  console.log(event.target)
  const url = document.getElementById('lurl').href
  const previewImage = document.getElementById('limage')
  // const imageH = document.getElementById('sideHeadImg')
  const imageInput = document.getElementById('upLinkImg')
  const file = imageInput.files[0]
  console.log(file)
  if (file) {
    const imageUrl = URL.createObjectURL(file)
    previewImage.src = imageUrl
    // imageH.src = imageUrl
  }

  if (event.target.id === 'option1') {
    console.log('Subimos imagen1')
    previewImage.src = '/img/opcion1.svg'
    // imageH.src = 'img/opcion1.svg'
  }
  if (event.target.id === 'option2') {
    console.log('Subimos imagen2')
    previewImage.src = '/img/opcion2.png'
    // imageH.src = 'img/opcion2.png'
  }
  if (event.target.id === 'option3') {
    console.log('Subimos imagen3')
    previewImage.src = '/img/opcion3.png'
    // imageH.src = 'img/opcion3.png'
  }
  if (event.target.id === 'option4') {
    console.log('Subimos imagen4')
    previewImage.src = '/img/opcion4.svg'
    // imageH.src = 'img/opcion3.png'
  }
  if (event.target.id === 'option5') {
    console.log('Subimos imagen5')
    previewImage.src = '/img/opcion5.svg'
    // imageH.src = 'img/opcion3.png'
  }
  if (event.target.id === 'option6') {
    console.log('Subimos imagen6')
    previewImage.src = '/img/opcion6.svg'
    // imageH.src = 'img/opcion3.png'
  }
  if (event.target.id === 'option7') {
    console.log('Subimos imagen7')
    previewImage.src = '/img/opcion7.png'
    // imageH.src = 'img/opcion3.png'
  }
  if (event.target.id === 'option8') {
    console.log('Subimos imagen8')
    previewImage.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`
    // imageH.src = 'img/opcion3.png'
  }
}
// Para guardar la imagen favicon del link
async function fetchLinkImage () {
  const image = document.getElementById('limage')
  const src = image.src
  console.log('🚀 ~ file: sidepanel.js:412 ~ fetchLinkImage ~ src:', src)
  const linkId = document.getElementById('linkId').innerText
  console.log(linkId)
  console.log(`Subimos la imagen ${src}`)
  console.log(src.indexOf('img'))
  const imageInput = document.getElementById('upLinkImg')
  const file = imageInput.files[0]
  if (file) {
    // const file = src
    const formData = new FormData()
    formData.append('linkImg', file)
    formData.append('linkId', linkId)
    console.log(formData)
    try {
      const response = await fetch('/api/uploadLinkImg', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const link = document.getElementById(linkId)
        link.childNodes[0].src = src
        const firstKey = Object.keys(result)[0]
        const firstValue = result[firstKey]

        if (firstKey === 'error') {
          sendMessage(false, `${firstKey}, ${firstValue}`)
        } else {
          sendMessage(true, 'Imagen cambiada!')
        }
        console.log(result)
      } else {
        console.error('Error al actualizar la ruta de la imagen')
        sendMessage(false, 'Error al cambiar imagen')
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
      sendMessage(false, 'Error al cambiar imagen')
    }
  } else {
    const formData = new FormData()
    formData.append('filePath', src)
    formData.append('linkId', linkId)
    console.log(formData)
    try {
      const response = await fetch('/api/uploadLinkImg', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const link = document.getElementById(linkId)
        link.childNodes[0].src = src
        const firstKey = Object.keys(result)[0]
        const firstValue = result[firstKey]

        if (firstKey === 'error') {
          sendMessage(false, `${firstKey}, ${firstValue}`)
        } else {
          sendMessage(true, 'Imagen cambiada!')
        }
        console.log(result)
      } else {
        sendMessage(false, 'Error al cambiar imagen')
        console.error('Error al actualizar la ruta de la imagen')
      }
    } catch (error) {
      sendMessage(false, 'Error al cambiar imagen')
      console.error('Error al realizar la solicitud:', error)
    }
  }
}

async function fetchImage () {
  const imagesContainer = document.getElementById('imgMasonry')
  const imagesCount = imagesContainer.childNodes.length
  console.log(imagesCount)
  const imageToUpload = imagesContainer.childNodes[imagesCount - 1].childNodes[0].src
  console.log(imageToUpload)
  const id = document.getElementById('linkId').innerText

  if (imagesCount === 0) {
    console.log('No hay imágenes para subir.')
    return
  }
  const formData = new FormData()

  const src = imageToUpload

  try {
    const response = await fetch(src)
    console.log(response)
    const blob = await response.blob()
    // eslint-disable-next-line no-undef
    const file = new File([blob], 'image', { type: blob.type })
    formData.append('images', file, 'image.png')
    formData.append('linkId', id)
    const res = await fetch('/api/uploadImg', {
      method: 'POST',
      body: formData
    })
    // Recibir la url definitiva e insertar en el src para evitar problemas
    if (res.ok) {
      const result = await res.json()
      const image = imagesContainer.childNodes[imagesCount - 1].childNodes[0]
      image.src = result.images[result.images.length - 1]
      const id = result.images[result.images.length - 1].match(/(\d+-\d+)/)[1]
      console.log(id)
      image.setAttribute('id', id)
      sendMessage(true, 'Imagen guardada.')
    } else {
      console.error('Error al subir las imágenes al servidor.')
      sendMessage(false, 'Error al guardar imagen')
    }
    console.log(formData)
  } catch (error) {
    console.error('Error al obtener la imagen:', error)
    sendMessage(false, 'Error en la comunicación con servidor')
  }
}
async function deleteImage (event) {
  const sender = event.target
  const idImg = sender.getAttribute('sender')
  const anchor = document.getElementById(idImg).parentNode
  const imageToDelete = document.getElementById(idImg).src
  const id = document.getElementById('linkId').innerText
  const imagesHolder = document.getElementById('linkImages')
  try {
    let body = {
      image: imageToDelete,
      id
    }
    body = JSON.stringify(body)
    const res = await fetch('/api/deleteImg', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body
    })
    if (res.ok) {
      const result = await res.json()
      console.log(result)
      const firstKey = Object.keys(result)[0]
      const firstValue = result[firstKey]

      if (firstKey === 'error' || firstKey === 'errors') {
        if (firstKey === 'errors') {
          sendMessage(false, `Error, valor ${firstValue[0].path} no válido`)
        } else {
          sendMessage(false, `${firstKey}, ${firstValue}`)
        }
      } else {
        anchor.remove()
        imagesHolder.style.backgroundImage = 'var(--placeholderImg)'
        if (document.getElementById('imgMasonry').children.length === 0) {
          document.getElementById('linkImages').style.backgroundImage = 'var(--placeholderImg)'
        }
        const confirmBox = document.getElementById('deleteLinkImgForm')
        confirmBox.style.display = 'none'
        makeMasonry()
        sendMessage(true, 'Imagen borrada correctamente')
      }
    } else {
      const error = await res.json()
      if (error.error === 'storage/invalid-url' || error.error === 'storage/object-not-found') {
        anchor.remove()
        imagesHolder.style.backgroundImage = 'var(--placeholderImg)'
        const confirmBox = document.getElementById('deleteLinkImgForm')
        confirmBox.style.display = 'none'
        makeMasonry()
        sendMessage(true, 'Referencia eliminada')
      } else {
        console.log(error)
        console.error(error.error)
        sendMessage(false, error.error)
      }
    }

    // if (res.ok) {
    //   const result = await res.json()
    //   console.log(result)
    //   console.log('Imágen borrada correctamente.')
    //   anchor.remove()
    //   if (document.getElementById('linkImages').children.length === 0) {
    //     document.getElementById('linkImages').style.backgroundImage = "url('../img/placeholderImg.svg')"
    //   }
    //   sendMessage(true, 'Imagen borrada correctamente')
    // } else {
    //   console.error('Error al subir las imágenes al servidor.')
    //   sendMessage(false, 'Error al borrar imagen')
    // }
  } catch (error) {
    console.error('Error al borrar la imagen:', error)
    sendMessage(false, 'Error en la comunicación con el servidor')
  }
}
function openModal (event) {
  console.log(event.target)
  const closers = Array.from(document.querySelectorAll('.icofont-close-line'))

  if (closers.includes(event.target)) {
    return false
  } else {
    const modal = document.getElementById('myModal')
    const img = event.target // event.target
    const modalImg = document.getElementById('img01')
    modal.style.display = 'flex'
    modalImg.src = img.src

    const span = document.getElementsByClassName('close')[0]
    span.addEventListener('click', () => {
      modal.style.display = 'none'
    })
  }
}

function confDeleteImage (event) {
  console.log(event.target.parentNode.childNodes[0])
  const confirmButton = document.getElementById('confDeleteImgSubmit')
  confirmButton.setAttribute('sender', event.target.parentNode.childNodes[0].id)
  const confirmBox = document.getElementById('deleteLinkImgForm')
  confirmBox.style.display = 'flex'
}
function closeConfDeleteImage () {
  const confirmBox = document.getElementById('deleteLinkImgForm')
  confirmBox.style.display = 'none'
}
function makeMasonry () {
  // setTimeout(() => {
  //   // console.log(masonry)
  // }, 100)
  // eslint-disable-next-line no-unused-vars, no-undef
  return new MiniMasonry({
    container: '#imgMasonry',
    baseWidth: 300
  })
}
async function getUrlStatus (url) {
  // console.log('🚀 ~ file: sidepanel.js:644 ~ getUrlStatus ~ url:', url)
  // console.log('Funciona Status')
  const query = await fetch(`/api/linkStatus?url=${url}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
  const res = await query.json()
  // console.log(res)
  const holder = document.getElementById('lactive')
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  let icon
  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      icon = '&#x1F198;'
    } else {
      icon = '&#x1F198;'
    }
    holder.innerHTML = icon
  } else {
    if (firstValue === 'success' || firstValue === 'redirect') {
      icon = '&#x1F197;'
    }
    if (firstValue === 'clientErr' || firstValue === 'serverErr') {
      icon = '&#x1F198;'
    }
    holder.innerHTML = icon
  }
}
