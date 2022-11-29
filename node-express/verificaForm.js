// VARIABLES //
const patron =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
var errores = []
// VARIABLES //

// LOGIN //
const loginForm = document.getElementById('login')

loginForm.addEventListener('submit', e => {
  e.preventDefault()
  errores = []
  const email = loginForm.elements['email'].value
  const password = loginForm.elements['password'].value

  if (email.length == 0) {
    errores.push('Debe ingresar un correo electrónico.\n')
  }
  if (!email.match(patron)) {
    errores.push('Debe ingresar un correo electrónico válido.\n')
  }
  if (password.length >= 1 && password.length < 8) {
    errores.push('La contraseña debe de tener más de 8 carácteres. \n')
  }
  if (password.length == 0) {
    errores.push('Debe ingresar una contraseña.\n')
  }

  if (errores.length > 0) {
    let mensaje = errores.reduce((cont, text) => cont + text)
    alert(mensaje)
  } else {
    loginForm.submit()
  }
})

// LOGIN //

// SIGNUP //
const signupForm = document.getElementById('signup')

signupForm.addEventListener('submit', e => {
  e.preventDefault()
  errores = []

  const name = signupForm.elements['name'].value
  const email = signupForm.elements['email'].value
  const password = signupForm.elements['password'].value
  const password2 = signupForm.elements['password2'].value

  if (name.length == 0) {
    errores.push('Debe ingresar un nombre de usuario.\n')
  }
  if (email.length == 0) {
    errores.push('Debe ingresar un correo electrónico.\n')
  }
  if (email.length > 0 && !email.match(patron)) {
    errores.push('Debe ingresar un correo electrónico válido.\n')
  }
  if (password.length >= 1 && password.length < 8) {
    errores.push('La contraseña debe de tener más de 8 carácteres. \n')
  }
  if (password.length == 0) {
    errores.push('Debe ingresar una contraseña.\n')
  }
  if (password != password2) {
    errores.push('La contraseña no coincide.\n')
  }

  if (errores.length > 0) {
    let mensaje = errores.reduce((cont, text) => cont + text)
    alert(mensaje)
  } else {
    signupForm.submit()
  }
})
// SIGNUP //
