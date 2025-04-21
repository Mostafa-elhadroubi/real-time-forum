import { updateLastMessage } from "./fetchMessages.js";
import { chatState } from "./fetchUsers.js";
// import { senderId } from "./fetchUsers.js";

export const sendMessage = (senderId, receiverId, socket, messageBox) => {
    const input = document.querySelector('.inputContainer input[type="text"]');
    const message = input.value;
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()

    if (message.trim()) {
        const data = {
            senderId: chatState.senderId, // Replace with actual sender ID
            receiverId: chatState.receiverId, // Replace with the receiver's ID (you need to implement this logic)
            text: message,
            timestamp: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        };
        socket.send(JSON.stringify(data)); // Send the message as a JSON string
        console.log(message)
        if((message.trim()).length != 0 ){
            const messageDiv = document.createElement('div');
            messageDiv.className = 'sender'// Assuming '1' is your userId
            const p = document.createElement('p');
            p.textContent = data.text; // textContent escapes HTML safely
            messageDiv.appendChild(p);
            const span = document.createElement('span');
            span.textContent = `${data.timestamp}`
            messageDiv.appendChild(span);
            
           chatState.messageBox.appendChild(messageDiv);
          
           chatState.messageBox.scrollTop = messageBox.scrollHeight
           console.log(data, "ggggg");
           
           updateLastMessage(data.senderId, data.receiverId, data.text, data.timestamp)
           input.value = ''; // Clear the input field
        }
    }
}

export const updateUserStatus = (userId, isOnline) => {
    const userBoxes = document.querySelectorAll('.userBox')
    console.log(userBoxes, "boxes")
    userBoxes.forEach(userBox => {
        const boxUserId = userBox.getAttribute('data-user-id')
        console.log(userId, boxUserId, "update user")
        if(userId == boxUserId) {
            const status = userBox.querySelector('.connected')
            if(status) {
                // status.textContent = isOnline ? 'Online' : 'Offline'
                status.style.backgroundColor = isOnline ? 'green' : 'red'
            }
        }
    })
}