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
  const accentColors = document.querySelectorAll('.accentColors')
  accentColors.forEach(color => {
    color.removeEventListener('click', selectAccentColor)
    color.addEventListener('click', selectAccentColor)
  })
  document.getElementById('themeSwitch').removeEventListener('click', selectTheme)
  document.getElementById('themeSwitch').addEventListener('click', selectTheme)

  if (window.localStorage.getItem('infoColor')) {
    const panel = document.querySelector('.sideInfo')
    const color = JSON.parse(window.localStorage.getItem('infoColor'))
    panel.style.background = color
  }
  // if (window.localStorage.getItem('accentColor')) {
  //   const color = JSON.parse(window.localStorage.getItem('accentColor'))
  //   document.documentElement.style.setProperty('--light-accentColor', color)
  // }
  // if (window.localStorage.getItem('bodyBackground')) {
  //   const url = JSON.parse(window.localStorage.getItem('bodyBackground'))
  //   document.body.style.backgroundImage = `url(${url})`
  // }
  // if (window.localStorage.getItem('theme')) {
  //   const theme = JSON.parse(window.localStorage.getItem('theme'))
  //   document.documentElement.classList.add(theme)
  // }
}
function addActiveClass () {
  // Pasar a select desktop
  const menuItems = document.querySelectorAll('.deskList')
  // const desktop = window.location.href
  // const partes = desktop.split('=')
  const valor = new URL(window.location.href)
  const valorDecodificado = decodeURIComponent(valor.pathname)
  menuItems.forEach(item => {
    if (item.attributes.href.textContent === valorDecodificado) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
}
async function selectBackground (event) {
  console.log(event.target)
  const nombre = event.target.alt
  if (event.target.nodeName === 'IMG') {
    const data = await fetch(`${constants.BASE_URL}/getBackground?nombre=${nombre}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    const url = await data.text()
    console.log(url)
    document.body.style.backgroundImage = `url(${url})`
    window.localStorage.setItem('bodyBackground', JSON.stringify(`${url}`))
  } else {
    document.body.style.backgroundImage = ''
    window.localStorage.setItem('bodyBackground', '')
  }
}
function selectInfoColor (event) {
  console.log(event.target.id)
  const panel = document.querySelector('.sideInfo')
  switch (event.target.id) {
    case 'theme':
      panel.style.background = 'var(--light-bgGradient)'
      window.localStorage.setItem('infoColor', JSON.stringify('var(--light-bgGradient)'))
      break
    case 'transparent':
      panel.style.background = 'transparent'
      window.localStorage.setItem('infoColor', JSON.stringify('transparent'))
      break
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
function selectAccentColor (event) {
  console.log(event.target.id)
  const color = event.target.id
  document.documentElement.style.setProperty('--light-accentColor', color)
  window.localStorage.setItem('accentColor', JSON.stringify(`${color}`))
}
