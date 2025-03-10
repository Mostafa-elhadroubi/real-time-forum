import { updateUserStatus } from "./sendMessages.js"
import { fetchUsers, senderId } from "./fetchUsers.js"
import { updateLastMessage } from "./fetchMessages.js"

export const chat = () => {
    const chat = `
                <div class="chatContainer">
                    <div class="chatBox">
                        
                    </div>
                    <div class="messageContainer">
                        
                    </div>
                </div>           
    `
    document.head.innerHTML = `<link rel="stylesheet" href="../css/chat.css">
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    `
    document.body.innerHTML = chat

    const chatBox = document.querySelector('.chatBox')
    const messageContainer = document.querySelector('.messageContainer')

    const socket = new WebSocket("ws://localhost:8081/ws")
    // When the WebSocket connection is open
    socket.onopen = function(event) {
        console.log("WebSocket connection established.");
    };

    socket.onclose = (event) => {
        console.log("Websocket connection is closed!")
        updateUserStatus(senderId, false)
    }
    // When a message is received from the WebSocket server
    socket.onmessage = (event) => {
        console.log("received message: ", event.data)
        const data = JSON.parse(event.data)
        console.log(data)
        if(data.userId !== undefined && data.isOnline !== undefined) {
            console.log('User status update:', data.userId, data.isOnline);
            updateUserStatus(data.userId, data.isOnline)
        } else {
            console.log(data)
            // Append the message to the chat box (you can style this however you want)
            const messageDiv = document.createElement('div');
            messageDiv.className = 'receiver'; // Assuming '1' is your userId
            messageDiv.innerHTML = `
                <p>${data.text}</p>
                <span>${data.timestamp}</span>
            `;
            document.querySelector('.messageBox').appendChild(messageDiv);
            updateLastMessage(data.receiverId, data.text, data.timestamp);
        }
    }
    fetchUsers(chatBox, messageContainer, socket)
    
}
