import { sendMessage } from "./sendMessages.js";
let isScrolled = false
export let msgNmb  = 0
export const fetchMessages = async(receiverId, msgNbr, senderId, messageBox, messageContainer, socket) => {
    try {
        const response = await fetch("/api/messages/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({ receiverId: receiverId, msgNbr: msgNbr })
        });
        console.log("fetch", msgNbr, receiverId)
        if (!response.ok) {
            alert("Error in fetching messages!");
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
        });
        // Scroll to the bottom of the message box
        if(!isScrolled) {
        messageBox.scrollTop = messageBox.scrollHeight;
        isScrolled = true
        }
        // Now, bind the sendMessage function to the "Send" button
        console.log("nowwww")
        console.log(senderId, receiverId,"msgsender")
        const sendButton = messageContainer.querySelector('input[type="button"]');
        sendButton.addEventListener('click', () => {
            sendMessage(senderId, receiverId, socket)
        });

        // messageBox.addEventListener("scroll", debounce(() => {
        //     fetchMessages(receiverId, msgNbr, senderId, messageBox, messageContainer)
        // }, 1000))
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while fetching messages!");
    }
}

export const updateLastMessage = (receiverId, message, timestamp) => {
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
