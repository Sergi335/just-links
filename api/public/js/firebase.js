import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js'
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js'
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
createUserWithEmailAndPassword(auth, 'sergiadn@hotmail.com', '652155671b45')
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user
    console.log(user)
  })
  .catch((error) => {
    const errorCode = error.code
    const errorMessage = error.message
    console.log(errorCode, errorMessage)
  })
createUserWithEmailAndPassword(auth, 'sergiadn@hotmail.com', '652155671b45')
