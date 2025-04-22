import { chatState } from "./fetchUsers.js";
import { sendMessage } from "./sendMessages.js";
export let msgNmb  = 0
export let isScrolled = false
export const fetchMessages = async(receiverId, msgNbr, senderId, messageBox, messageContainer, socket) => {
    try {
        const previousScrollHeight = chatState.messageBox.scrollHeight
        const response = await fetch("/api/messages/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({ receiverId: receiverId, msgNbr: msgNbr })
        });
        console.log("fetch", msgNbr, receiverId)
        if (!response.ok) {
            let obj = await response.json()
            setError(obj.Message)  
            return;
        }

        const data = await response.json();
        console.log(data);

        // Loop through each message in the response data
        data.forEach(item => {
            let div = document.createElement('div');
            let parag = document.createElement('p');
            let span = document.createElement('span');

            div.className = item.Sender_id == senderId ? 'sender' : 'receiver';
            parag.textContent = `${item.Message}`;
            let date = convertTime(item.Sent_at);
            span.textContent = `${date.hours.toString().padStart(2, '0')}:${date.minutes.toString().padStart(2, '0')}`;
            msgNmb++
            div.append(parag, span);
            messageBox.insertAdjacentElement("afterbegin", div);
            const newScrollHeight = messageBox.scrollHeight
            messageBox.scrollTop = newScrollHeight - previousScrollHeight - 10
        });
        
        // }
        console.log(senderId, receiverId,"msgsender")
        const sendButton = messageContainer.querySelector('input[type="button"]');
        const messageInput = messageContainer.querySelector('input[type="text"]');
        messageInput.addEventListener('keyup', (e) => {
            // const msgRead = document.querySelectorAll('.userBox')[receiverId]
            const userBox = document.querySelector(`.userBox[data-user-id="${receiverId}"]`);
            console.log(userBox);
            if (userBox) {
                
                userBox.style.border = '';
                userBox.style.backgroundColor = '';
            }
            // console.log('input is  clicked', messageInput.value.trim(),messageInput.value.trim().length)
            if(e.key == 'Enter' && messageInput.value.trim() != ''){
            sendMessage(chatState.senderId, chatState.receiverId, socket, chatState.messageBox)
            }
        })
        sendButton.addEventListener('click', () => {
            sendMessage(chatState.senderId, chatState.receiverId, socket, chatState.messageBox)
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while fetching messages!");
    }
}

export const updateLastMessage = (senderId, receiverId, message, timestamp) => {
    const userBoxes = document.querySelectorAll('.userBox')
    console.log(userBoxes);
    const chatBox = document.querySelector('.chatBox')
    userBoxes.forEach((userBox, index) => {
        const userId = userBox.getAttribute("data-user-id")
        
        if(userId == parseInt(senderId) || userId == parseInt(receiverId) ) {
            console.log("Sender",senderId, "RECEV", receiverId, userId);

            console.log(userBox);
            
            const lastMessage = userBox.querySelector('.user-message .message');
            console.log(lastMessage);
            const lastMessageTime = userBox.querySelector('.time')
            console.log(lastMessageTime);
            
            if(lastMessage && lastMessageTime) {
                lastMessage.textContent = message;
                
                console.log(lastMessage.textContent);
                lastMessageTime.textContent = timestamp;
                console.log("try")
                // if()
                // userBox.style.cssText = `border: 2px solid green; background-color: rgba(0, 128, 0, 0.3);`
                console.log("sender placed");
                chatBox.insertBefore(userBox, chatBox.firstChild)
            }
            

        }
        if(userId == parseInt(senderId)) {
            console.log("receiver placed");
            userBox.style.cssText = `border: 2px solid green; background-color: rgba(0, 128, 0, 0.3);`
        }
        
    })
}

export const convertTime = (Time) => {
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
