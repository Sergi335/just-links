import { constants } from './functions.mjs'
document.addEventListener('DOMContentLoaded', loadStyles)

function loadStyles () {
  addActiveClass()
  if (window.matchMedia('(min-width: 1536px)').matches) {
    if (!document.body.classList.contains('edit')) {
      sideInfo()
      handleResize()
      setColsAtStart()
    }
  }
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
    // const panel = document.querySelector('.sideInfo')
    const color = JSON.parse(window.localStorage.getItem('infoColor'))
    // color === 'var(--bgGradient)'
    //   ? panel.style.borderRadius = '5px'
    //   : panel.style.borderRadius = '0'
    // panel.style.background = color
    selectInfoColor(undefined, color)
  }
  if (window.localStorage.getItem('buttonTextColor')) {
    const color = JSON.parse(window.localStorage.getItem('buttonTextColor'))
    document.documentElement.style.setProperty('--buttonTextColor', color)
  }
  const sideBlocks = Array.from(document.querySelectorAll('.sect'))
  sideBlocks.forEach(panel => {
    panel.removeEventListener('click', putIntoView)
    panel.addEventListener('click', putIntoView)
  })
  window.removeEventListener('resize', handleResize)
  window.addEventListener('resize', handleResize)

  const selectCols = document.getElementById('colsSelect')
  selectCols.removeEventListener('change', handleSelectCols)
  selectCols.addEventListener('change', handleSelectCols)
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
function selectInfoColor (event, style) {
  const currentStyle = event?.target.id || style
  const panel = document.querySelector('.sideInfo')
  switch (currentStyle) {
    case 'theme':
      panel.style.background = 'var(--bgGradient)'
      panel.style.backdropFilter = 'none'
      panel.style.borderRadius = '5px'
      window.localStorage.setItem('infoColor', JSON.stringify('theme'))
      break
    case 'transparent':
      panel.style.background = 'transparent'
      panel.style.backdropFilter = 'none'
      panel.style.borderRadius = '0'
      window.localStorage.setItem('infoColor', JSON.stringify('transparent'))
      break
    case 'blur':
      panel.style.background = 'transparent'
      panel.style.backdropFilter = 'blur(15px)'
      panel.style.borderRadius = '5px'
      window.localStorage.setItem('infoColor', JSON.stringify('blur'))
      break
  }
}
function selectTheme (event) {
  const root = document.documentElement
  if (root.classList.contains('dark')) {
    root.classList.remove('dark')
    root.classList.add('light')
    window.localStorage.setItem('theme', JSON.stringify('light'))
  } else if (root.classList.contains('light')) {
    root.classList.remove('light')
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
      document.documentElement.style.setProperty('--buttonTextColor', '#4e4e4e')
      window.localStorage.setItem('accentColor', JSON.stringify('#ffff00'))
      window.localStorage.setItem('buttonTextColor', JSON.stringify('#4e4e4e'))
      break
    case 'blue':
      document.documentElement.style.setProperty('--accentColor', 'cornflowerblue')
      document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
      window.localStorage.setItem('accentColor', JSON.stringify('cornflowerblue'))
      window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
      break
    case 'green':
      document.documentElement.style.setProperty('--accentColor', '#00cc66')
      document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
      window.localStorage.setItem('accentColor', JSON.stringify('#00cc66'))
      window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
      break
    case 'defaultLight':
      document.documentElement.style.setProperty('--accentColor', '#bababa')
      document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
      window.localStorage.setItem('accentColor', JSON.stringify('#bababa'))
      window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
      break
    case 'defaultDark':
      document.documentElement.style.setProperty('--accentColor', '#bf7272')
      document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
      window.localStorage.setItem('accentColor', JSON.stringify('#bf7272'))
      window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
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
function sideInfo () {
  const sideBlocks = Array.from(document.querySelectorAll('.sect'))
  // console.log(sideBlocks)
  sideBlocks[0].classList.add('sectActive')
  const elements = sideBlocks.map(el => (
    {
      el,
      mappedEls: Array.from(el.children).map(item => (document.getElementById((`${item.id}`).replace('Side', ''))))
    }
  ))
  // console.log(elements)
  const contenedor = document.body
  contenedor.onscroll = function (event) {
    // Por cada panel izquierdo recogemos las props de cada elemento mapeado
    elements.forEach(targ => {
      const props = targ.mappedEls.map(elem => (
        elem.getBoundingClientRect()
      ))
      // console.log(targ.mappedEls)
      // cogemos el primero por que todos están a la misma altura
      const elementTopPosition = props[0].top
      // console.log('🚀 ~ file: styles.js:163 ~ sideInfo ~ elementTopPosition:', elementTopPosition)
      // de las props cogemos el valor bottom
      // const elementMaxBottomPosition = props.map(elem => (
      // elem.bottom
      // ))
      // Y seleccionamos el mayor de cada panel
      // const maxBottom = Math.max(...elementMaxBottomPosition)
      // console.log(maxBottom)
      // console.log(elementMaxBottomPosition)
      // si la posicion de la parte superior de la fila es mayor a 141 y menor a 1414 o la posicion bottom maxima de cada columna es mayor a 141 o menor a 1414
      if (Math.abs(elementTopPosition >= 141) && Math.abs(elementTopPosition <= 1141)) {
        targ.el.classList.add('sectActive')
      } else {
        targ.el.classList.remove('sectActive')
      }
    })
  }
}
export function putIntoView (event) {
  console.log(event.target)
  event.preventDefault()
  // const sideBlocks = Array.from(document.querySelectorAll('.sect'))
  const escritorio = document.body.getAttribute('data-desk')
  const element = document.getElementById(`${escritorio}${event.target.innerText}`)
  element.scrollIntoView({ block: 'center', behavior: 'smooth' })
  element.parentNode.classList.add('sideInfoSelectedCol')
  setTimeout(() => {
    element.parentNode.classList.remove('sideInfoSelectedCol')
  }, 1000)
  console.log(element)
}

function handleResize () {
  const desk = document.body.getAttribute('data-desk')
  const container = document.getElementById(`${desk}Cols`)
  const columnsWrapper = document.querySelectorAll('.envolt')
  const containerWidth = container.clientWidth
  const paddingAndGap = 60
  const elements = Array.from(document.querySelectorAll('.sect'))
  // console.log('🚀 ~ file: styles.js:201 ~ handleResize ~ containerWidth:', containerWidth)
  const colWidth = columnsWrapper[0].clientWidth + paddingAndGap
  // console.log('🚀 ~ file: styles.js:203 ~ handleResize ~ colWidth:', colWidth)
  const numCols = Math.floor(containerWidth / colWidth)
  // console.log('🚀 ~ file: styles.js:205 ~ handleResize ~ numCols:', numCols)
  if (numCols === 0 || numCols === 1) {
    groupBy(elements, 1)
  }
  if (numCols === 2) {
    groupBy(elements, 2)
  }
  if (numCols === 3) {
    groupBy(elements, 3)
  }
  if (numCols === 4) {
    groupBy(elements, 4)
  }
  if (numCols === 5) {
    groupBy(elements, 5)
  }
}

export function groupBy (elements, numberCols) {
  // console.log('Agrupamos por ' + numberCols)
  // console.log(elements)
  if (Array.isArray(elements) === false) throw new Error('El parámetro debe ser un array')
  if (typeof numberCols !== 'number') throw new Error('El parámetro debe ser un número')
  // Aplanamos el array de entrada para calcular filas
  const flatArray = elements.map(element => Array.from(element.childNodes)).flat()
  // El numero de filas es la longitud total partido por el numero de columnas
  const numRows = Math.ceil(flatArray.length / numberCols)
  // Declaramos el contenedor
  const container = document.getElementById('sectContainer')
  // Declaramos la variable result
  const result = []
  // Hacemos la magia negra
  for (let i = 0; i < numRows; i++) {
    const startIdx = i * numberCols
    const row = flatArray.slice(startIdx, startIdx + numberCols)
    result.push(row)
  }
  // Mapeamos el resultado de la magia a HTML
  const res = result.map((subarray) => {
    const divContent = subarray.map((element) => element.outerHTML).join('')
    return `<div class="sect">${divContent}</div>`
  })
  container.innerHTML = res.join('')
  sideInfo()
  return result
}

function handleSelectCols (event) {
  console.log(event.target)
  console.log(event.target.value === '1')
  const elements = Array.from(document.querySelectorAll('.sect'))
  const columns = document.querySelectorAll('.envolt')
  if (event.target.value === '1') {
    columns.forEach(col => {
      col.style.width = '100%'
    })
    groupBy(elements, 1)
    window.localStorage.setItem('columnWidth', JSON.stringify('100%'))
  }
  if (event.target.value === '2') {
    columns.forEach(col => {
      col.style.width = '48%'
    })
    groupBy(elements, 2)
    window.localStorage.setItem('columnWidth', JSON.stringify('48%'))
  }
  if (event.target.value === '3') {
    columns.forEach(col => {
      col.style.width = '30%'
    })
    groupBy(elements, 3)
    window.localStorage.setItem('columnWidth', JSON.stringify('30%'))
  }
  if (event.target.value === '4') {
    columns.forEach(col => {
      col.style.width = '390px'
    })
    groupBy(elements, 4)
    window.localStorage.setItem('columnWidth', JSON.stringify('390px'))
  }
  if (event.target.value === '5') {
    columns.forEach(col => {
      col.style.width = '300px'
    })
    groupBy(elements, 5)
    window.localStorage.setItem('columnWidth', JSON.stringify('300px'))
  }
  const sideBlocks = Array.from(document.querySelectorAll('.sect'))
  sideBlocks.forEach(panel => {
    panel.removeEventListener('click', putIntoView)
    panel.addEventListener('click', putIntoView)
  })
  window.localStorage.setItem('columns', JSON.stringify(event.target.value))
}

function setColsAtStart () {
  const selector = document.getElementById('colsSelect')
  const elements = Array.from(document.querySelectorAll('.sect'))
  const columns = document.querySelectorAll('.envolt')
  if (window.localStorage.getItem('columns')) {
    selector.value = JSON.parse(window.localStorage.getItem('columns'))
    groupBy(elements, Number(JSON.parse(window.localStorage.getItem('columns'))))
  } else {
    selector.value = constants.COLUMN_COUNT
  }
  if (window.localStorage.getItem('columnWidth')) {
    columns.forEach(col => {
      col.style.width = JSON.parse(window.localStorage.getItem('columnWidth'))
    })
  } else {
    columns.forEach(col => {
      col.style.width = constants.COLUMN_WIDTH
    })
  }
  const sideBlocks = Array.from(document.querySelectorAll('.sect'))
  sideBlocks.forEach(panel => {
    panel.removeEventListener('click', putIntoView)
    panel.addEventListener('click', putIntoView)
  })
}
