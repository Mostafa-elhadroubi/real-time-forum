export const signUp = () => {
    const signup = `
    <div class="signUpContainer">
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
                            <input type="submit" id="submit">
                        </form>
                        <div class="hasAccount">Already has an account? <a href="/login">Login</a></div>
                    </div>  
    `
    document.body.innerHTML = signup
    const emailError = document.querySelector('.emailError')
    const passwordError = document.querySelector('.passwordError')
    const signupForm = document.querySelector('#signupForm')
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault()
        emailError.innerHTML = ''
        passwordError.innerHTML = ''
        submitSignUpForm(emailError, passwordError)
        
    })
}

const submitSignUpForm = (emailError, passwordError) => {
//    emailError = document.querySelector('.emailError')
//     passwordError = document.querySelector('.passwordError')
    const formData = new FormData(signupForm)
    console.log(formData)
    let email = formData.get('email')
    let password = formData.get('password')
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!regex.test(email)){
        emailError.innerHTML = 'Invalid Email'
    }else if(password.length <= 5){
        passwordError.innerHTML = 'password must contains more than 8 charachters!'
    } else {
        fetch("/api/signUp/", {
            method: 'POST',
            body: formData
        })
    }

}