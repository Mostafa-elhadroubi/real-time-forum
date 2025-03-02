const convertTime = (Time) => {
    let date = new Date(Time * 1000)
    let dateObj = {
        minutes: date.getMinutes(),
        hours: date.getHours(),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
    }
    return dateObj

}
const updateLastMessage = (receiverId, message, timestamp) => {
    const userBoxes = document.querySelectorAll('.userBox')
    userBoxes.forEach(userBox => {
        const userId = userBox.getAttribute("data-user-id")
        if(userId == receiverId) {
            const lastMessage = userBox.querySelector('.user-message p');
            const lastMessageTime = userBox.querySelector('.time')
            if(lastMessage && lastMessageTime) {
                lastMessage.textContent = message;
                lastMessageTime.textContent = timestamp;
            }
        }
    })
}

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
    let receiverId;
    let senderId;
    const chatBox = document.querySelector('.chatBox')
    const messageContainer = document.querySelector('.messageContainer')

    const socket = new WebSocket("ws://localhost:8083/ws")
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
            console.log("undefined")
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
    
    const sendMessage = () => {
        const input = document.querySelector('.inputContainer input[type="text"]');
        const message = input.value;
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        if (message.trim()) {
            const data = {
                senderId: senderId, // Replace with actual sender ID
                receiverId: receiverId, // Replace with the receiver's ID (you need to implement this logic)
                text: message,
                timestamp: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
            };
            socket.send(JSON.stringify(data)); // Send the message as a JSON string
            console.log(message)
            if((message.trim()).length != 0){
                const messageDiv = document.createElement('div');
                messageDiv.className = 'sender'// Assuming '1' is your userId
                messageDiv.innerHTML = `
                    <p>${data.text}</p>
                    <span>${data.timestamp}</span>
                `;
               document.querySelector('.messageBox').appendChild(messageDiv);
               updateLastMessage(data.receiverId, data.message, data.timestamp)
               input.value = ''; // Clear the input field
            }
        }
    }
    fetch("/api/users/", {
        method: 'POST'
    })
    .then(response => {
        if(!response.ok) {
            console.log("Error fetching users", response.statusText)
            return
        }
        return response.json()
    })
    .then(data => {
        chatBox.innerHTML = ''
        data = data.filter(item => item.ConnectedUserId != item.Id)
        data.forEach((item) => {
            let content = `
                <div class="userBox" data-user-id=${item.Id}>
                    <div class="img-username">
                        <img src="../images/${item.Image}" alt="profile picture">
                        <span class="connected"></span>
                        <div class="user-message">
                            <h2>${item.Username}</h2>
                            <p>The last message was sent....</p>
                        </div>
                    </div>
                    <div class="time-msgNumber">
                        <div class="time">yesterday</div>
                        <span>3</span>
                    </div>
                </div>
            `
                chatBox.innerHTML += content 
            senderId = item.ConnectedUserId
        })
        console.log(data)
        const allUsers = document.querySelectorAll('.userBox')
        console.log([...allUsers])
        
        allUsers.forEach((user, index) => {
            user.addEventListener('click', () => {
                console.log(`${data[index].Username}`)
                messageContainer.innerHTML = ''
               messageContainer.style.cssText = `width: 70%;`
                messageContainer.innerHTML = `
                                                <div class="username-arrowLeft">
                                                    <i class="fa-solid fa-arrow-left"></i>
                                                    <div class="username">${data[index].Username}</div>
                                                </div>
                                                <div class="messageBox">
                                                   
                                                </div>
                                                <div class="inputContainer">
                                                    <input type="text" placeholder="Type your message...">
                                                    <input type="button" value="send">
                                                </div>
                `
                const messageBox = document.querySelector('.messageBox')
                receiverId = data[index].Id
                let msgNbr = 0
                console.log(receiverId, "js")
                fetch("/api/messages/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({receiverId: receiverId, msgNbr: msgNbr})
                })
                .then(response => {
                    if(!response.ok) {
                        alert("Error in fetching messages!")
                    }
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    data.forEach(item => {
                        let div = document.createElement('div')
                        let parag = document.createElement('p')
                        let span = document.createElement('span')
                        div.className = item.Sender_id == senderId ? 'sender' : 'receiver'
                        parag.textContent = `${item.Message}`
                        let date = convertTime(item.Sent_at)
                        span.textContent = `${date.hours.toString().padStart(2, '0')}:${date.minutes.toString().padStart(2, '0')}`
                        div.append(parag, span)
                        messageBox.insertAdjacentElement("afterbegin", div)
                    })
                })
                // Now, bind the sendMessage function to the "Send" button
                const sendButton = messageContainer.querySelector('input[type="button"]');
                sendButton.addEventListener('click', sendMessage);
            })
        })
    })
}


const updateUserStatus = (userId, isOnline) => {
    const userBoxes = document.querySelectorAll('.userBox')
    console.log(userBoxes, "boxes")
    userBoxes.forEach(userBox => {
        const boxUserId = userBox.getAttribute('data-user-id')
        console.log(userId, boxUserId, "update user")
        if(userId == boxUserId) {
            const status = userBox.querySelector('.connected')
            if(status) {
                // status.textContent = isOnline ? 'Online' : 'Offline'
                status.style.backgroundColor = isOnline ? 'green' : 'blue'
            }
        }
    })
}
