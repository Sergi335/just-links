import { mostrarMenu } from './scripts3.js'
window.onload = function () {
  // console.log('Hay búsqueda')
  const searchInput = document.getElementById('searchInput')
  const resultsContainer = document.getElementById('resultsContainer')

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim()
    if (query !== '') {
      searchLinks(query)
    } else {
      resultsContainer.innerHTML = ''
    }
  })
}
function searchLinks (query) {
  const handleClickOutside = (event) => {
    const searchInput = document.getElementById('searchInput')
    if (!resultsContainer.contains(event.target) && event.target !== searchInput) {
      resultsContainer.innerHTML = ''
      resultsContainer.style.display = 'none'
      searchInput.value = ''
    }
  }
  const searchInput = document.getElementById('searchInput')
  const { left, width } = searchInput.getBoundingClientRect()
  console.log(left)
  const resultsContainer = document.getElementById('resultsContainer')
  fetch(`/api/search?query=${query}`)
    .then(response => response.json())
    .then(data => {
      // Limpia el contenedor de resultados
      resultsContainer.innerHTML = ''

      console.log(data)
      // Recorre los resultados y crea elementos para mostrarlos en el panel flotante
      data.forEach(result => {
        const $div = document.createElement('div')
        $div.setAttribute('class', 'link')
        $div.setAttribute('id', `${result._id}`)
        const $img = document.createElement('img')
        $img.setAttribute('src', `${result.imgURL}`)
        $div.appendChild($img)
        const linkElement = document.createElement('a')
        const nameSpan = document.createElement('span')
        const descSpan = document.createElement('span')
        nameSpan.setAttribute('class', 'title')
        descSpan.setAttribute('class', 'description')
        descSpan.innerText = result.description
        // Separa el título en fragmentos que contengan la coincidencia
        const titleFragments = result.name.split(new RegExp(`(${query})`, 'gi'))
        // Recorre los fragmentos y crea nodos de texto y elementos <mark> según corresponda
        titleFragments.forEach((fragment, index) => {
          if (fragment.toLowerCase() === query.toLowerCase()) {
            const markElement = document.createElement('mark')
            markElement.style.backgroundColor = 'yellow'
            markElement.textContent = fragment
            nameSpan.appendChild(markElement)
          } else {
            const textNode = document.createTextNode(fragment)
            nameSpan.appendChild(textNode)
          }
        })
        linkElement.appendChild(nameSpan)
        linkElement.appendChild(descSpan)
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
        const $idColumn = document.createElement('p')
        $idColumn.setAttribute('class', 'idpanel')
        const $idColumnText = document.createTextNode(`idpanel: ${result.idpanel}`)
        $idColumn.appendChild($idColumnText)
        $div.appendChild(linkElement)
        $div.appendChild($deskInfo)
        $div.appendChild($columnInfo)
        $div.appendChild($urlInfo)
        $div.appendChild($idColumn)

        resultsContainer.appendChild($div)
        $div.addEventListener('contextmenu', mostrarMenu)
      })
      resultsContainer.style.display = 'flex'
      resultsContainer.style.left = `${left}px`
      resultsContainer.style.width = `${width - 2}px`
      document.addEventListener('click', handleClickOutside)
    })
    .catch(error => {
      console.error('Error al realizar la búsqueda:', error)
    })
}
