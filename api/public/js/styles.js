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

  document.getElementById('showMenu').removeEventListener('click', showMenu)
  document.getElementById('showMenu').addEventListener('click', showMenu)

  if (window.localStorage.getItem('infoColor')) {
    const panel = document.querySelector('.sideInfo')
    const color = JSON.parse(window.localStorage.getItem('infoColor'))
    color === 'var(--bgGradient)'
      ? panel.style.borderRadius = '5px'
      : panel.style.borderRadius = '0'
    panel.style.background = color
  }
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
      panel.style.background = 'var(--bgGradient)'
      panel.style.borderRadius = '5px'
      window.localStorage.setItem('infoColor', JSON.stringify('var(--bgGradient)'))
      break
    case 'transparent':
      panel.style.background = 'transparent'
      panel.style.borderRadius = '0'
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
  switch (color) {
    case 'yellow':
      document.documentElement.style.setProperty('--accentColor', '#ffff00')
      window.localStorage.setItem('accentColor', JSON.stringify('#ffff00'))
      break
    case 'blue':
      document.documentElement.style.setProperty('--accentColor', 'cornflowerblue')
      window.localStorage.setItem('accentColor', JSON.stringify('cornflowerblue'))
      break
    case 'green':
      document.documentElement.style.setProperty('--accentColor', '#00cc66')
      window.localStorage.setItem('accentColor', JSON.stringify('#00cc66'))
      break
    case 'defaultLight':
      document.documentElement.style.setProperty('--accentColor', '#bababa')
      window.localStorage.setItem('accentColor', JSON.stringify('#bababa'))
      break
    case 'defaultDark':
      document.documentElement.style.setProperty('--accentColor', '#bf7272')
      window.localStorage.setItem('accentColor', JSON.stringify('#bf7272'))
      break
  }
}
function showMenu () {
  console.log('click')
  const menu = document.getElementById('drpEscritorios')
  if (window.matchMedia('(min-width: 1536px)').matches) {
    menu.classList.toggle('slideUp')
  } else {
    if (menu.style.transform === 'translateX(-100%)' || menu.style.transform === '') {
      menu.style.transform = 'translateX(0)'
    } else {
      menu.style.transform = 'translateX(-100%)'
    }
  }
}
