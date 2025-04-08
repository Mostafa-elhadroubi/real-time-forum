import { getCookie } from "./getcookie.js"

export const login = () => {
    const login = `
                <div class="containerBody">
                    <div class="loginContainer">
                        <h1 class="loginHeader">Login</h1>
                        <div class="errorCookie"></div>
                        <form id="loginForm">
                            <label>Username/E-mail:<input type="text" name="username" placeholder="Enter your Username or Email" required></label>
                            <div class="emailError"></div>
                            <label>Password:<input type="password" name="password" placeholder="Enter your Password" required></label>
                            <div class="passwordError"></div>
                            <button class="loginBtn">Login</button>
                        </form>
                        <div class="hasAccount hasnotAccount">Has not an account yet? <a href="/signup">Sign Up</a></div>  
                    </div>
                </div>
    `
    document.body.innerHTML = login
    const emailError = document.querySelector('.emailError')
    const passwordError = document.querySelector('.passwordError')
    const loginForm = document.querySelector('#loginForm')
    const errorCookie = document.querySelector('.errorCookie')
    errorCookie.innerHTML = getCookie()
    if(getCookie() == "") {
        errorCookie.classList.remove("errorCookie")
    }
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        emailError.innerHTML = ''
        passwordError.innerHTML = ''
        submitLoginForm(emailError, passwordError)
    })
}
const submitLoginForm = () => {
    let formData = new FormData(loginForm)
    fetch('/api/login/', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        console.log(res)
        if(res.redirected) {
            window.location.href = res.url
        }
    })
    .catch(error => {
        console.log('Error: ', error)
    })
}

