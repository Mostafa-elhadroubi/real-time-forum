import { getCookie } from "./getcookie.js"

export const signup = () => {
    const signup = `
                <div class="containerBody">
                    <div class="signupContainer">
                        <h1 class="signupHeader">Sign Up</h1>
                        <div class="errorCookie"></div>
                        <form id="signupForm">
                            <label>Username:<input type="text" name="username" placeholder="Enter your Username" required></label>
                            <label>First Name:<input type="text" name="firstName" placeholder="Enter your First Name" required></label>
                            <label>Last Name:<input type="text" name="lastName" placeholder="Enter your Last Name" required></label>
                            <label>Age:<input type="text" name="age" placeholder="Enter your Age" required></label>
                            <label>Gender:
                                <input type="radio" name="gender" value="Male" id="male"><label for="male">Male</label>
                                <input type="radio" name="gender" value="Female" id="female"><label for="female">Female</label>
                            </label>
                            <label>E-mail:<input type="email" name="email" placeholder="Enter your Email" required></label>
                            <div class="emailError"></div>
                            <label>Password:<input type="password" name="password" placeholder="Enter your Password" required></label>
                            <div class="passwordError"></div>
                            <button class="signupBtn">Sign Up</button>
                        </form>
                        <div class="hasAccount hasnotAccount">Already has an account? <a href="/login">Login</a></div>
                    </div>  
                </div>
    `
    document.body.innerHTML = signup
    const emailError = document.querySelector('.emailError')
    const passwordError = document.querySelector('.passwordError')
    const signupForm = document.querySelector('#signupForm')
    const errorCookie = document.querySelector('.errorCookie')
        errorCookie.innerHTML = getCookie()
        if(getCookie() == "") {
            errorCookie.classList.remove("errorCookie")
        }
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault()
        emailError.innerHTML = ''
        passwordError.innerHTML = ''
        submitsignupForm(emailError, passwordError)
        
    })
}

const submitsignupForm = (emailError, passwordError) => {
    const formData = new FormData(signupForm)
    console.log(formData)
    let email = formData.get('email')
    let password = formData.get('password')
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const regexPassword = /[a-zA-Z0-9]{8,}/
    if(!regexEmail.test(email)){
        emailError.innerHTML = 'Invalid Email'
    }else if(!regexPassword.test(password)){
        passwordError.innerHTML = 'Must contains Upper, Lower, Digit and more than 8 charachters!'
    } else {
        fetch("/api/signup/", {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log(response)
            if(response.redirected) {
                window.location.href = response.url
            }
        })
        .catch(error => {
            console.log('Error: ', error)
        })
    }

}