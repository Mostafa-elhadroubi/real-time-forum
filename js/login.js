import { getCookie } from "./getcookie.js"
import { navigateTo } from "./main.js"

export let socket = null

export const login = (app) => {
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
    document.head.innerHTML = `<link rel="stylesheet" href="../css/signup.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
`
    app.innerHTML = login
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
        if(!res.ok) {

            const errorHTML = res.text();
            document.body.innerHTML = errorHTML;
            return;
        } 
        navigateTo("/home")
        // socket  = new WebSocket("ws://localhost:8082/ws")
        // alert("")
        
        // ccc(socket)
        // history.pushState({}, '', '/');
        // socket.onopen = function(event) {
        //     console.log("connectedgfgfgfg");
         
        //     console.log(socket);
        // }
        // if(res.redirected) {
            
        //     window.location.href = res.url
        // }
    })
    .catch(error => {
        console.log('Error: ', error)
    })
}

const ccc = (socket) => {
    socket.addEventListener('open', () =>{
        console.log("connectedgfgfgfg");
     
        console.log(socket);
    })
}