window.onload = function () {
  const btnStart = document.getElementById('btnStart')
  const constants = {
    // BASE_URL: 'https://just-links.vercel.app/'
    BASE_URL: ''
  }
  btnStart.addEventListener('click', () => {
    console.log('Has hecho click')
    const logBlock = document.querySelector('#loginForm form')
    const regBlock = document.querySelector('#registerForm form')
    const visible = logBlock.style.display === 'flex'

    logBlock.style.display = visible ? 'none' : 'flex'

    if (regBlock.style.display === 'flex') {
      regBlock.style.display = 'none'
    }
  })

  const btnChangeForm = document.querySelector('#loginForm a')

  btnChangeForm.addEventListener('click', () => {
    console.log('Has hecho click')
    const logBlock = document.querySelector('#loginForm form')
    const visible = logBlock.style.display === 'flex'
    logBlock.style.display = visible ? 'none' : 'flex'
    const regBlock = document.querySelector('#registerForm form')
    regBlock.style.display = 'flex'
  })
  const btnChangeForm2 = document.querySelector('#registerForm a')

  btnChangeForm2.addEventListener('click', () => {
    console.log('Has hecho click')
    const regBlock = document.querySelector('#registerForm form')
    const visible = regBlock.style.display === 'flex'
    regBlock.style.display = visible ? 'none' : 'flex'
    const logBlock = document.querySelector('#loginForm form')
    logBlock.style.display = 'flex'
  })

  document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault() // Evita que el formulario se envíe de forma predeterminada

    // Obtén los valores de los campos del formulario
    const nick = document.getElementById('loginName').value
    const password = document.getElementById('loginPass').value

    // Crea un objeto con los datos del formulario
    const formData = {
      name: nick,
      password
    }

    // Realiza la solicitud fetch para enviar los datos del formulario
    fetch(`${constants.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(function (response) {
        // Maneja la respuesta de la solicitud fetch
        if (response.ok) {
          // La solicitud fue exitosa
          console.log(response)
          return response.json()
        } else {
          // La solicitud falló
          throw new Error('Error en la solicitud')
        }
      })
      .then(function (data) {
        // Maneja los datos de respuesta del servidor
        console.log(data)
        const keys = Object.keys(data)
        const primerKey = keys[0]
        const primerValor = data[primerKey]
        if (primerKey === 'message') {
          console.log(primerKey)
          const logBlock = document.getElementById('error')
          logBlock.innerHTML = primerValor
        } else {
          const token = data.token
          console.log(token)
          const user = data.user
          console.log(user[0].name)
          // document.cookie = `token=${token}; path=/; expires=Thu, 01 Jan 2024 00:00:00 UTC; domain=tudominio.com; secure;`;
          document.cookie = `token=${token}`
          document.cookie = `user=${user[0].name}`
          window.location = `${constants.BASE_URL}/templates`
        }
      })
      .catch(function (error) {
        // Maneja los errores
        console.error(error)
      })
  })

  document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault() // Evita que el formulario se envíe de forma predeterminada

    // Obtén los valores de los campos del formulario
    const email = document.getElementById('registerEmail').value
    const password = document.getElementById('registerPass').value
    const name = document.getElementById('registerName').value

    // Crea un objeto con los datos del formulario
    const formData = {
      email,
      password,
      name
    }

    // Realiza la solicitud fetch para enviar los datos del formulario
    fetch(`${constants.BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(function (response) {
        // Maneja la respuesta de la solicitud fetch
        if (response.ok) {
          // La solicitud fue exitosa
          return response.json()
        } else {
          // La solicitud falló
          throw new Error('Error en la solicitud')
        }
      })
      .then(function (data) {
        // Maneja los datos de respuesta del servidor
        console.log(data)
        const keys = Object.keys(data)
        const primerKey = keys[0]
        const primerValor = data[primerKey]
        if (primerKey === 'message') {
          console.log(primerKey)
          const regBlock = document.querySelector('#registerForm form')
          regBlock.innerHTML += primerValor
        } else {
          const token = data.token
          console.log(token)
          const user = data.user
          console.log(user.name)
          // document.cookie = `token=${token}; path=/; expires=Thu, 01 Jan 2024 00:00:00 UTC; domain=tudominio.com; secure;`;
          document.cookie = `token=${token}`
          document.cookie = `user=${user.name}`
        }
      }).then(function () {
        window.location = 'http://localhost:3001/templates'
        // setTimeout(function () {
        //   window.location.reload()
        // }, 10000)
        // no funciona por que es otra pag sin este archivo JS
      })
      .catch(function (error) {
        // Maneja los errores
        console.error(error)
      })
  })
}
