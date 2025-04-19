import { updateUserStatus } from "./sendMessages.js"
import { chatState, displayUsers, senderId } from "./fetchUsers.js"
import { updateLastMessage } from "./fetchMessages.js"
import { header } from "./header.js"
import { headerEvents } from "./home.js"


export const chat = (app) => {
    document.head.innerHTML = `<link rel="stylesheet" href="../css/chat.css">
    <link rel="stylesheet" href="../css/home.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    `
    const chat = `
    <div class="chatContainer">
                    <div class="chatBox">
                        
                    </div>
                    
                </div>           
    `
    app.innerHTML = `
    ${header}
    ${chat}
    `
    headerEvents()
    const chatBox = document.querySelector('.chatBox')
    const messageContainer = document.querySelector('.messageContainer')
    const chatContainer = document.querySelector('.chatContainer')

    
    const socket = new WebSocket("ws://localhost:8082/ws")
    // aaaaa()
    // When the WebSocket connection is open
    socket.onopen = function(event) {
        console.log("WebSocket connection established.");
        fetchOnlineUsers()
    };

    socket.onclose = (event) => {
        console.log("Websocket connection is closed!")
        updateUserStatus(senderId, false)
    }
    // When a message is received from the WebSocket server
    socket.onmessage = (event) => {
        onMessage(event)
    }
    displayUsers(chatBox, messageContainer, socket)
    
}

export const onMessage = (event) => {
    console.log("ddddddddddddddd");
    
    console.log("received message: ", event.data)
    const data = JSON.parse(event.data)
    console.log(data)
    if(data.userId !== undefined && data.isOnline !== undefined) {
        console.log('User status update:', data.userId, data.isOnline);
        updateUserStatus(data.userId, data.isOnline)
    } else {
        console.log(data)
        if(chatState.messageBox) {
            console.log(chatState.messageBox.parentElement);
            const msgContainerId = parseInt(chatState.messageBox.parentElement.getAttribute('id'))
            console.log(msgContainerId);
            if(msgContainerId == data.senderId){
                const messageDiv = document.createElement('div');
                messageDiv.className = 'receiver'; // Assuming '1' is your userId
                messageDiv.setAttribute('id', data.senderId)
                const p = document.createElement('p');
                p.textContent = data.text; // textContent escapes HTML safely
                messageDiv.appendChild(p);
                const span = document.createElement('span');
                span.textContent = `${data.timestamp}`
                messageDiv.appendChild(span);
        
                chatState.messageBox.appendChild(messageDiv);
            }
            chatState.messageBox.scrollTop = chatState.messageBox.scrollHeight
            console.log(data, "my data");
        }
        
        updateLastMessage(data.senderId, data.receiverId, data.text, data.timestamp);
    }
}
export const fetchOnlineUsers = async() => {
    try{
        const response = await fetch('/getOnlineUsers')
        console.log(response)
        const onlineUsers = await response.json()
        console.log("online users",onlineUsers)
        onlineUsers.forEach(userId => {
            updateUserStatus(userId, true)
        })
    }catch(error) {
        console.log("error", error)
    }
    

}
fetchOnlineUsers()
