export const signUp = () => {
    const signup = `
                    <div class="container">
                        <form id="signupForm">
                            <label>UserName:<input type="text" placeholder="Enter your username"></label>
                            <label>Age:<input type="text" placeholder="Enter your age"></label>
                            <label>Gender:
                                <input type="checkbox" name="gender" value="Male">Male
                                <input type="checkbox" name="gender" value="Female">Female
                            </label>
                            <label>First Name:<input type="text" placeholder="Enter your first Name"></label>
                            <label>Last Name:<input type="text" placeholder="Enter your Last Name"></label>
                            <label>E-mail:<input type="text" placeholder="Enter your Email"></label>
                            <label>Password:<input type="text" placeholder="Enter your Password"></label>
                            <input type="submit" id="submit">
                        </form>
                    </div>  
    `
    document.body.innerHTML = signup
}

const 