import { constants, openTab } from './functions.mjs'

document.addEventListener('DOMContentLoaded', editMode)

function editMode () {
  const columnas = document.querySelectorAll('.tablinks')
  columnas.forEach(col => {
    col.removeEventListener('click', openTab)
    col.addEventListener('click', openTab)
  })
  // const desk = document.body.getAttribute('data-desk')
  // document.body.setAttribute('data-desk', `${desk}`)
  const $raiz = document.querySelector('.tab')
  const hijos = $raiz.childNodes
  hijos.forEach(element => {
    ordenaItemsEdit(element.innerHTML)
  })
  ordenaColsEdit($raiz)
  // Get the element with id="defaultOpen" and click on it
  if (columnas.length > 0) {
    document.querySelector('.defaultOpen').click()
  }
  const enlaces = document.querySelectorAll('.lcontrols')
  enlaces.forEach(enlace => {
    enlace.addEventListener('click', (event) => {
      const link = event.currentTarget.parentNode.childNodes[1].href
      window.open(link, '_blank')
    })
  })
  const closeIcon = document.querySelector('.icofont-close')
  closeIcon.classList = 'icofont-expand'
  const expandIcon = document.querySelector('.icofont-expand')
  expandIcon.removeEventListener('click', expandPanel)
  expandIcon.addEventListener('click', expandPanel)
  const skeleton = document.querySelector('.skeleton-loader')
  skeleton.style.opacity = '0'
  skeleton.style.visibility = 'hidden'
  const content = document.querySelector('.cuerpoInt')
  content.style.visibility = 'visible'
  content.style.opacity = '1'
}

function ordenaColsEdit ($raiz) {
  // eslint-disable-next-line no-undef
  Sortable.create($raiz, {

    group: 'ColumnasEdit',
    onEnd: async function (evt) {
      // const itemEl = evt.item
      // console.log(itemEl)
      const escritorio = document.body.getAttribute('data-desk')
      const elements = document.querySelector('.tab').childNodes
      // console.log(elements)

      const sortedElements = Array.from(elements).sort((a, b) => {
        return a.dataset.orden - b.dataset.orden
      })
      // console.log(sortedElements)
      const names = []
      sortedElements.forEach(element => {
        names.push(element.dataset.db)
      })
      // console.log(names)
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
function ordenaItemsEdit (panel) {
  if (panel !== null) {
    const escritorio = document.body.getAttribute('data-desk')
    // console.log(escritorioActual)
    const el = []
    el.push(document.getElementById(`edit${escritorio}${panel}`).childNodes[0])
    // console.log(el)
    el.forEach(element => {
      const grupo = `Shared${escritorio}`
      // eslint-disable-next-line no-undef, no-unused-vars
      const sortableList = Sortable.create(element, {
        group: grupo,
        options: {
          sort: false,
          dataIdAttr: 'data-id'
        },
        onEnd: async function (evt) {
          const idpanel = evt.to.attributes[2].nodeValue.replace(/edit/g, '')
          console.log(idpanel)
          const itemEl = evt.item
          const nombre = itemEl.childNodes[1].childNodes[0].innerText
          const id = itemEl.id.replace(escritorio, '')
          const panel = itemEl.parentNode.id.replace(escritorio, '')
          const elements = document.querySelector(`[data-db="edit${idpanel}"]`).childNodes
          const orden = elements.length
          console.log(elements)
          // let id = elements[0].parentNode.getAttribute('data-db')
          // id = idpanel.replace(/edit/g, '')
          // console.log(id)
          const sortedElements = Array.from(elements).sort((a, b) => {
            return a.dataset.orden - b.dataset.orden
          })
          // console.log(sortedElements)
          const destinyIds = []
          sortedElements.forEach(element => {
            destinyIds.push(element.id)
          })
          console.log(destinyIds)
          let body = { id, destinyIds, fields: { escritorio, name: nombre, idpanel, panel, orden } }
          console.log(body)
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
      })
    })
  }
}
function expandPanel () {
  const panel = document.querySelector('#sidepanel')
  // onst cuerpo = document.querySelector('.cuerpoInt')
  const tab = document.querySelector('.tab')
  const theTabcontents = Array.from(document.querySelectorAll('.tabcontent'))
  let tabcontent = theTabcontents.filter(tab => {
    return tab.style.display === 'grid' || tab.classList.contains('selected')
  })
  console.log(tabcontent[0])
  const id = tabcontent[0].id
  console.log(id)
  tabcontent = document.getElementById(id)
  tabcontent.classList.add('selected')
  console.log(tabcontent)
  if (panel.style.width === 'calc(100% - 8px)' || panel.style.width === undefined) {
    tabcontent = document.querySelector('.selected')
    tabcontent.classList.remove('selected')
    panel.style.position = 'sticky'
    panel.classList.remove('maximized')
    panel.style.width = '45%'
    makeMasonry()
    setTimeout(function () {
      tabcontent.style.display = 'grid'
      tab.style.display = 'block'
    }, 300)
  } else {
    panel.classList.add('maximized')
    panel.style.width = 'calc(100% - 8px)'
    panel.style.position = 'fixed'
    panel.style.top = '126px'
    panel.style.left = '0'
    tabcontent.style.display = 'none'
    tab.style.display = 'none'
    makeMasonry()
  }
}
function makeMasonry (loader = '') {
  setTimeout(() => {
    // eslint-disable-next-line no-unused-vars, no-undef
    const masonry = new MiniMasonry({
      container: '#imgMasonry',
      baseWidth: 300
    })
    console.log(masonry)
  }, 100)
  if (loader) {
    loader.style.display = 'none'
  }
}
