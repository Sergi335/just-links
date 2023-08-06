import { sendMessage, constants } from './functions.mjs'
document.addEventListener('DOMContentLoaded', cargaProfile)
function cargaProfile () {
  console.log('Hay JS')
  darHora()
  progressCircle()
  document.body.classList.add('profile')
  const clsAccButton = document.getElementById('closeAccount')
  clsAccButton.addEventListener('click', openConfirm)

  // Agregar evento de clic al botón de ir a perfil
  document.querySelector('#profile').removeEventListener('click', profile)
  document.querySelector('#profile').addEventListener('click', profile)
  // Agregar evento de clic al botón de cerrar sesión
  document.querySelector('#logout').removeEventListener('click', logOut)
  document.querySelector('#logout').addEventListener('click', logOut)
  // Agregar evento click a cada elemento de la lista de de selección escritorios
  document.querySelectorAll('.deskList').forEach(item => {
    item.removeEventListener('click', selectDesktop)
    item.addEventListener('click', selectDesktop)
  })
  // Agregar evento de clic al botón de crear backup
  document.querySelector('#backup').removeEventListener('click', createBackup)
  document.querySelector('#backup').addEventListener('click', createBackup)
  // Agregar evento de clic al botón de descargar backup
  document.querySelector('#download').removeEventListener('click', downloadBackup)
  document.querySelector('#download').addEventListener('click', downloadBackup)
  // Agregar evento de change al botón de subir archivo
  document.querySelector('#upFile').removeEventListener('change', uploadFile)
  document.querySelector('#upFile').addEventListener('change', uploadFile)
  // Agregar evento de change al botón de subir archivo
  document.querySelector('#image-input').removeEventListener('change', uploadImg)
  document.querySelector('#image-input').addEventListener('change', uploadImg)

  document.querySelector('#defaultOpen').addEventListener('click', openSection)
  document.querySelector('#profileSeg').addEventListener('click', openSection)
  document.querySelector('#profilePreferences').addEventListener('click', openSection)

  // Get the element with id="defaultOpen" and click on it
  document.getElementById('defaultOpen').click()

  document.querySelector('#changePassword').removeEventListener('click', handleChangePassword)
  document.querySelector('#changePassword').addEventListener('click', handleChangePassword)
  document.querySelector('#changePasswordCancel').removeEventListener('click', handleChangePassword)
  document.querySelector('#changePasswordCancel').addEventListener('click', handleChangePassword)
  document.querySelector('#changePasswordSubmit').removeEventListener('click', changePassword)
  document.querySelector('#changePasswordSubmit').addEventListener('click', changePassword)
  document.getElementById('duplicates').removeEventListener('click', findDuplicates)
  document.getElementById('duplicates').addEventListener('click', findDuplicates)
  document.getElementById('brokenLinks').removeEventListener('click', findBrokenLinks)
  document.getElementById('brokenLinks').addEventListener('click', findBrokenLinks)
}
function profile () {
  window.history.back()
}
function logOut () {
  console.log('Cierra sesión')
  document.cookie = 'token='
  window.location = '/'
}
async function selectDesktop (event) {
  event.stopPropagation()
  const deskName = event.target.innerText
  window.location = `/${deskName}`
}
function openConfirm () {
  const $confirmForm = document.getElementById('profileDeleteConfirm')
  $confirmForm.style.display = 'flex'
  const $cancelButton = document.getElementById('cancel')
  $cancelButton.addEventListener('click', () => {
    $confirmForm.style.display = 'none'
  })
  const $confirmButton = document.getElementById('confirm')
  $confirmButton.addEventListener('click', () => {
    deleteAccount()
  })
}
async function deleteAccount () {
  console.log('Cuenta cerrada')
  // llamar a eliminaUsuario de auth.js
  const res = await fetch('/deleteUser', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await res.json()
  document.cookie = 'token='
  document.cookie = 'user='
  // Primero ventanita, confirmar y redirigir
  window.location = '/'
  console.log(json)
}
async function createBackup () {
  try {
    const res = await fetch('/api/backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    console.log(json)
    // const successP = document.getElementById('successMessage')
    sendMessage(true, json.mensaje)
    // successP.innerText = json.mensaje
  } catch (error) {
    console.log(error)
    const errorP = document.getElementById('errorMessage')
    errorP.innerText = error
  }
}
async function downloadBackup () {
  try {
    const res = await fetch('/api/downloadBackup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
      throw new Error('Error al descargar la copia de seguridad')
    }
    const json = await res.json()
    console.log(json)
    const { downloadUrl } = json
    window.open(downloadUrl)

    const successP = document.getElementById('successMessage')
    successP.innerText = 'Copia de seguridad descargada correctamente.'
  } catch (error) {
    console.error(error)
    const errorP = document.getElementById('errorMessage')
    errorP.innerText = 'Error al descargar la copia de seguridad.'
  }
}
async function uploadFile (event) {
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('backupFile', file)

  try {
    // Enviar el archivo al servidor utilizando una solicitud POST
    const response = await fetch('/uploadBackup', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      console.log(result)
      const successP = document.getElementById('successUpMessage')
      successP.innerText = result.mensaje
      // Realizar cualquier acción adicional después de subir el archivo correctamente
    } else {
      throw new Error('Error al subir el archivo')
    }
  } catch (error) {
    console.error(error)
    // Manejar el error de subida del archivo
    const errorP = document.getElementById('errorUpMessage')
    errorP.innerText = error
  }
}
async function uploadImg (event) {
  console.log(event.srcElement.files[0])
  const previewImage = document.getElementById('preview-image')
  const imageInput = document.getElementById('image-input')

  const file = imageInput.files[0]

  if (file) {
    console.log(file)
    const imageUrl = URL.createObjectURL(file)
    previewImage.src = imageUrl
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch('/uploadImgProfile', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result)
        console.log('Ruta de imagen actualizada correctamente')
        const firstKey = Object.keys(result)[0]
        const firstValue = result[firstKey]

        if (firstKey === 'error') {
          sendMessage(false, `${firstKey}, ${firstValue}`)
        } else {
          const avatar = document.querySelector('#profile img')
          avatar.src = imageUrl
          sendMessage(true, 'Imagen Cambiada')
        }
      } else {
        console.error('Error al actualizar la ruta de la imagen')
        sendMessage(false, 'Error al actualizar la ruta de la imagen')
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
      sendMessage(false, `Error al realizar la solicitud:, ${error}`)
    }
  }
}
function openSection (event) {
  let i
  console.log(event.target.id)
  console.log()
  let section = ''
  const tabcontent = document.getElementsByClassName('tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none'
  }
  const tablinks = document.getElementsByClassName('tablinks')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '')
  }
  if (event.target.id === 'defaultOpen') {
    section = 'info'
  }
  if (event.target.id === 'profileSeg') {
    section = 'security'
  }
  if (event.target.id === 'profilePreferences') {
    section = 'preferences'
  }
  document.getElementById(section).style.display = 'flex'
  event.currentTarget.className += ' active'
}
function handleChangePassword () {
  const dialog = document.getElementById('changePasswordDialog')
  if (dialog.style.display === 'none' || dialog.style.display === '') {
    dialog.style.display = 'flex'
  } else {
    dialog.style.display = 'none'
  }
}
async function changePassword () {
  const oldPassword = document.getElementById('oldPassword').value
  const newPassword = document.getElementById('newPassword').value
  let body = { oldPassword, newPassword }
  body = JSON.stringify(body)
  console.log(body)
  const res = await fetch('/changePassword', {
    method: 'POST',
    headers: {
      'content-Type': 'Application/json'
    },
    body
  })

  const data = await res.json()
  console.log(data)
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
export function darHora () {
  hora()
  setInterval(hora, 60000)
}
async function findDuplicates () {
  const $raiz = document.getElementById('duplicatesResult')
  const $raiz2 = document.getElementById('brokenLinksResult')
  $raiz2.innerHTML = ''
  $raiz.innerHTML = ''
  const data = await fetch(`${constants.BASE_URL}/duplicados`, {
    method: 'GET',
    headers: {
      contentType: 'application/json'
    }
  })
  const res = await data.json()
  console.log(res)
  res.forEach(result => {
    const $div = document.createElement('div')
    $div.setAttribute('class', 'link')
    const $img = document.createElement('img')
    $img.setAttribute('src', `${result.imgURL}`)
    const linkElement = document.createElement('a')
    linkElement.appendChild($img)
    const textNode = document.createTextNode(result.name)
    linkElement.appendChild(textNode)
    linkElement.setAttribute('target', '_blank')
    linkElement.href = result.URL
    const $columnInfo = document.createElement('p')
    const $columnInfoText = document.createTextNode(`Panel: ${result.panel}`)
    $columnInfo.appendChild($columnInfoText)
    const $deskInfo = document.createElement('p')
    const $deskInfoText = document.createTextNode(`Escritorio: ${result.escritorio}`)
    $deskInfo.appendChild($deskInfoText)
    const $urlInfo = document.createElement('p')
    const $urlInfoText = document.createTextNode(`url: ${result.URL}`)
    $urlInfo.appendChild($urlInfoText)
    $div.appendChild(linkElement)
    $div.appendChild($deskInfo)
    $div.appendChild($columnInfo)
    $div.appendChild($urlInfo)

    $raiz.appendChild($div)
  })
}
async function findBrokenLinks () {
  const $raiz = document.getElementById('duplicatesResult')
  const $raiz2 = document.getElementById('brokenLinksResult')
  $raiz2.innerHTML = ''
  const $ppc = document.querySelector('.progress-pie-chart')
  if ($ppc.classList.contains('fade-off')) {
    $ppc.classList.remove('fade-off')
  }
  if ($ppc.classList.contains('gt-50')) {
    $ppc.classList.remove('gt-50')
  }
  $ppc.dataset.percent = 0
  const $fill = document.querySelector('.ppc-progress-fill')
  $fill.style.transform = 'rotate(0deg)'
  const result = document.querySelector('.ppc-percents span')
  result.innerHTML = 0 + '%'
  if ($raiz.childElementCount > 1) {
    $raiz.innerHTML = ''
  }
  $ppc.style.display = 'block'
  const data = await fetch(`${constants.BASE_URL}/allLinks`, {
    method: 'GET',
    headers: {
      contentType: 'application/json'
    }
  })
  const res = await data.json()
  // res = res.slice(0, 50)
  console.log(res.length)
  const porcentajePorPaso = 100 / res.length
  console.log(porcentajePorPaso)
  const numeroPasos = Math.ceil(100 / porcentajePorPaso)
  console.log('🚀 ~ file: profile.js:325 ~ findBrokenLinks ~ numeroPasos:', numeroPasos)
  let count = 0
  const downLinks = await Promise.all(res.map(async (link) => {
    const response = await fetch(`${constants.BASE_URL}/linkStatus?url=${link.URL}`, {
      method: 'GET',
      headers: {
        contentType: 'application/json'
      }
    })
    const data = await response.json()
    if (data.status !== 'success') {
      count += porcentajePorPaso
      return { data, link }
    }
    count += porcentajePorPaso
    $ppc.dataset.percent = count
    progressCircle()
    // console.log(count)
    return null
  }))
  const filteredLinks = downLinks.filter(link => link !== null)
  console.log(filteredLinks)
  const root = document.getElementById('brokenLinksResult')
  filteredLinks.forEach(l => {
    printLinks(root, l.link)
  })
  $ppc.classList.add('fade-off')
  $ppc.style.display = 'none'
}

function progressCircle () {
  const $ppc = document.querySelector('.progress-pie-chart')
  const percent = parseInt($ppc.dataset.percent)
  const deg = 360 * percent / 100

  if (percent > 50) {
    $ppc.classList.add('gt-50')
  }
  const $fill = document.querySelector('.ppc-progress-fill')
  $fill.style.transform = `rotate(${deg}deg)`
  const result = document.querySelector('.ppc-percents span')
  result.innerHTML = percent + '%'
}

function printLinks (root, link) {
  const $div = document.createElement('div')
  $div.setAttribute('class', 'link')
  const $img = document.createElement('img')
  $img.setAttribute('src', `${link.imgURL}`)
  const linkElement = document.createElement('a')
  linkElement.appendChild($img)
  const textNode = document.createTextNode(link.name)
  linkElement.appendChild(textNode)
  linkElement.setAttribute('target', '_blank')
  linkElement.href = link.URL
  const $columnInfo = document.createElement('p')
  const $columnInfoText = document.createTextNode(`Panel: ${link.panel}`)
  $columnInfo.appendChild($columnInfoText)
  const $deskInfo = document.createElement('p')
  const $deskInfoText = document.createTextNode(`Escritorio: ${link.escritorio}`)
  $deskInfo.appendChild($deskInfoText)
  const $urlInfo = document.createElement('p')
  const $urlInfoText = document.createTextNode(`url: ${link.URL}`)
  $urlInfo.appendChild($urlInfoText)
  $div.appendChild(linkElement)
  $div.appendChild($deskInfo)
  $div.appendChild($columnInfo)
  $div.appendChild($urlInfo)

  root.appendChild($div)
}
