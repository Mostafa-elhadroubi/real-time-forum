import { chat } from "./chat.js";
import { home } from "./home.js";
import { login } from "./login.js";
import { signup } from "./signup.js";
import { add_post } from "./addPost.js";
import { logout } from "./logout.js";

// let url = location.pathname
// console.log(url);

// switch(url) {
//     case "/signup":
//         signup();
//         break;
//     case "/login":
//         login();
//         break;
//     case "/logout":
//         logout();
//         break;
//     case "/home":
//         home();
//         break;
//     case "/chat":
//         chat();
//         break;
//     case "/addPost":
//         add_post();
//         break;

// }


export const navigateTo = async(url) => {
if(!await checkLogin()){
    url = "/login"
    // console.log(await checkLogin());
    
}
    const app = document.querySelector('.app')
    console.log(url);
    history.pushState({}, "", url)

    app.innerHTML = ''
    
    switch(url) {
        case "/signup":
            signup(app);
            break;
        case "/login":
            login(app);
            break;
        case "/logout":
            logout(app);
            break;
        case "/home":
            home(app);
            break;
        case "/chat":
            chat(app);
            break;
        case "/addPost":

            add_post(app);
            break;
        default:
            errorPage();
            break;
    
    }
}
addEventListener('DOMContentLoaded', () => {
    let url = location.pathname
    console.log(url);
    navigateTo(url)
    
})
const errorPage = () => {
    const app = document.querySelector('.app')
    app.innerHTML = `<h1>page not found</h1>`
}

addEventListener('popstate', () => {
    console.log(location.pathname);
    navigateTo(location.pathname)
    
    
})
const checkLogin = async() => {
    const res = await fetch('/checkLogin', {
        method: 'GET',
        credentials: 'include'
    })
    console.log(res);
    console.log("okkkkkk", res.status);
    if(res.ok) {
        return true
    }else {
        return false
    }

    
}