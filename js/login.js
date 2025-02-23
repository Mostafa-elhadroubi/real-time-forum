export const login = () => {
    const login = `
                <div class="loginContainer">
                    <h1>Login</h1>
                    <form id="loginForm">
                        <label>Username/E-mail:<input type="text" name="username" placeholder="Enter your Username or Email" required></label>
                        <div class="emailError"></div>
                        <label>Password:<input type="password" name="password" placeholder="Enter your Password" required></label>
                        <div class="passwordError"></div>
                        <button>Login</button>
                    </form>
                    <div class="hasAccount">Has not an account yet? <a href="/signup">Sign Up</a></div>  
                </div>
    `
    document.body.innerHTML = login
}