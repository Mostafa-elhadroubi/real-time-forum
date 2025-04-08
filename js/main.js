import { chat } from "./chat.js";
import { home } from "./home.js";
import { login } from "./login.js";
import { signup } from "./signup.js";
import { add_post } from "./addPost.js";

let url = location.pathname
console.log(url);

switch(url) {
    case "/signup":
        signup();
        break;
    case "/login":
        login();
        break;
    case "/logout":
        logout();
        break;
    case "/home":
        home();
        break;
    case "/chat":
        chat();
        break;
    case "/addPost":
        add_post();
        break;

}


