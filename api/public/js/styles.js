import { constants } from './functions.mjs'
document.addEventListener('DOMContentLoaded', loadStyles)

function loadStyles () {
  addActiveClass()
  const backgrounds = document.querySelectorAll('.miniatures')
  backgrounds.forEach(back => {
    back.removeEventListener('click', selectBackground)
    back.addEventListener('click', selectBackground)
  })
  const colors = document.querySelectorAll('.infoColors')
  colors.forEach(color => {
    color.removeEventListener('click', selectInfoColor)
    color.addEventListener('click', selectInfoColor)
  })
  document.getElementById('themeSwitch').removeEventListener('click', selectTheme)
  document.getElementById('themeSwitch').addEventListener('click', selectTheme)

  if (window.localStorage.getItem('infoColor')) {
    const panel = document.querySelector('.sideInfo')
    const color = JSON.parse(window.localStorage.getItem('infoColor'))
    panel.style.backgroundColor = color
  }
  if (window.localStorage.getItem('bodyBackground')) {
    const url = JSON.parse(window.localStorage.getItem('bodyBackground'))
    document.body.style.backgroundImage = `url(${url})`
  }
  if (window.localStorage.getItem('theme')) {
    const theme = JSON.parse(window.localStorage.getItem('theme'))
    document.documentElement.classList.add(theme)
  }
}
function addActiveClass () {
  // Pasar a select desktop
  const menuItems = document.querySelectorAll('.deskList')
  const desktop = window.location.href
  const partes = desktop.split('=')
  const valor = partes.pop()
  const valorDecodificado = decodeURIComponent(valor)
  menuItems.forEach(item => {
    if (item.innerText === valorDecodificado) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
  if (window.location.href === 'http://localhost:3001/templates') {
    menuItems[0].classList.add('active')
  }
}
function selectBackground (event) {
  console.log(event.target)
  if (event.target.nodeName === 'IMG') {
    const extension = 'webp'
    const oldRoute = event.target.alt
    const extActual = oldRoute.split('.').pop()
    const ruta = oldRoute.replace(`.${extActual}`, `.${extension}`)
    document.body.style.backgroundImage = `url(${constants.BACKGROUNDS_URL}${ruta})`
    window.localStorage.setItem('bodyBackground', JSON.stringify(`${constants.BACKGROUNDS_URL}${ruta}`))
  } else {
    document.body.style.backgroundImage = ''
    window.localStorage.setItem('bodyBackground', '')
  }
}
function selectInfoColor (event) {
  console.log(event.target.id)
  const panel = document.querySelector('.sideInfo')
  if (event.target.id === 'accentColor') {
    panel.style.backgroundColor = 'var(--light-accentColor)'
    window.localStorage.setItem('infoColor', JSON.stringify('var(--light-accentColor)'))
  } else {
    panel.style.backgroundColor = event.target.id
    window.localStorage.setItem('infoColor', JSON.stringify(event.target.id))
  }
}
function selectTheme (event) {
  const root = document.documentElement
  if (root.classList.contains('dark')) {
    root.classList.remove('dark')
    window.localStorage.setItem('theme', JSON.stringify('light'))
  } else {
    root.classList.add('dark')
    window.localStorage.setItem('theme', JSON.stringify('dark'))
  }
}
