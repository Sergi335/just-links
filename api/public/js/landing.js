import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js'
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js'
// ...

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDpLDFsm4FgCkw5YP6aRfjFJ8eo5kakNpE',
  authDomain: 'justlinks-7330b.firebaseapp.com',
  projectId: 'justlinks-7330b',
  storageBucket: 'justlinks-7330b.appspot.com',
  messagingSenderId: '788955672995',
  appId: '1:788955672995:web:9ced722a20e33f6a01ea16'
}

// Initialize Firebase
initializeApp(firebaseConfig)
const auth = getAuth()

const handleMailLoginFirebase = (email, password) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log(user)
        resolve(user.accessToken) // Resuelve la promesa con el usuario
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
        reject(errorMessage) // Rechaza la promesa con el mensaje de error
      })
  })
}
window.onload = function () {
  const btnStart = document.getElementById('btnStart')
  btnStart.addEventListener('click', () => {
    console.log('Has hecho click')
    const homePage = document.getElementById('homepage')
    const loginPage = document.getElementById('loginPage')

    homePage.style.display = 'none'
    loginPage.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    // const logBlock = document.querySelector('#loginForm form')
    // const regBlock = document.querySelector('#registerForm form')
    // const visible = logBlock.style.display === 'flex'

    // logBlock.style.display = visible ? 'none' : 'flex'

    // if (regBlock.style.display === 'flex') {
    //   regBlock.style.display = 'none'
    // }
  })

  const btnChangeForm = document.querySelector('#loginForm a')
  const btnChangeForm2 = document.querySelector('#registerForm a')

  btnChangeForm.addEventListener('click', () => {
    const logBlock = document.querySelector('#loginForm')
    const regBlock = document.querySelector('#registerForm')
    logBlock.style.display = 'none'
    regBlock.style.display = 'flex'
  })

  btnChangeForm2.addEventListener('click', () => {
    const regBlock = document.querySelector('#registerForm')
    const logBlock = document.querySelector('#loginForm')
    regBlock.style.display = 'none'
    logBlock.style.display = 'flex'
  })

  /**
   * Login
   */
  document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault()

    const nick = document.getElementById('loginName').value
    const password = document.getElementById('loginPass').value
    const email = document.getElementById('loginMail').value
    const idToken = await handleMailLoginFirebase(email, password)
    console.log('🚀 ~ file: landing.js:81 ~ idToken:', idToken)
    const formData = {
      method: 'mail',
      data: {
        name: nick,
        email,
        password,
        idToken
      }
    }

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(function (response) {
        if (response.ok) {
          console.log(response)
          return response.json()
        } else {
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
          document.cookie = `token=${token}`
          document.cookie = `user=${user[0].name}`
          window.location = '/desktop/inicio'
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
    fetch('/register', {
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
        window.location = '/templates'
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
  document.getElementById('googleSignIn').addEventListener('click', () => {
    fetch('/signWithGoogle', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Error en la solicitud')
      }
    }).then(data => {
      console.log(data)
    })
  })
}
