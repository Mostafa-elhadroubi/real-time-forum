// import { convertTime } from "./chat.js";
import { sendMessage } from "./sendMessages.js";

export const fetchMessages = async(receiverId, msgNbr, senderId, messageBox, messageContainer) => {
    try {
        const response = await fetch("/api/messages/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiverId: receiverId, msgNbr: msgNbr })
        });

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

            div.append(parag, span);
            messageBox.insertAdjacentElement("afterbegin", div);
        });
        // Scroll to the bottom of the message box
        messageBox.scrollTop = messageBox.scrollHeight;
        
        // Now, bind the sendMessage function to the "Send" button
        console.log("nowwww")
        const sendButton = messageContainer.querySelector('input[type="button"]');
        sendButton.addEventListener('click', sendMessage);

        // Optional: Detect when the user scrolls to the top (near the start of the message box)
        messageBox.addEventListener("scroll", () => {
            if (messageBox.scrollTop <= 5) {
                console.log(messageBox.scrollTop, "yes");
            }
        });

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
