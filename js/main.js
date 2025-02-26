import { chat } from "./chat.js";
import { home } from "./home.js";
import { login } from "./login.js";
import { signup } from "./signup.js";

let url = location.pathname
switch(url) {
    case "/signup":
        signup();
        break;
    case "/login":
        login();
        break;
    case "/logout":
        logout();
    case "/home":
        home();
        break;
    case "/chat":
        chat();
        break;
    

}


