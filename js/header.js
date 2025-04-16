import { login } from "./login.js";
import { navigateTo } from "./main.js";

export const header = `
    <header>
        <div class="logo"><img src="../images/forum.png" id="image"/></div>
        <nav>
            <ul>
                <li id="addpost"><i class="fa-solid fa-circle-plus"></i>Add Post</li>
                <li id="chat"><i class="fa-brands fa-rocketchat"></i>Chat</li>
                <li id="logout"><i class="fa-solid fa-right-from-bracket"></i>Logout</li>
            </ul>
        </nav>
    </header>
`
