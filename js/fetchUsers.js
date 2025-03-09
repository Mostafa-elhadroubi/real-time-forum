import { debounce } from "./debounce.js";
import { msgNmb, fetchMessages, convertTime } from "./fetchMessages.js";
let receiverId;
export let messageBox
export let senderId;

export const fetchUsers = async(chatBox, messageContainer, socket) =>  {
    try {
        const response = await fetch("/api/users/", { method: 'POST' });

        if (!response.ok) {
            console.log("Error fetching users", response.statusText);
            return;
        }

        const data = await response.json();

        chatBox.innerHTML = '';
        console.log(data)
        const filteredData = data.filter(item => item.ConnectedUserId !== item.Id);
        console.log(filteredData, "data")
        filteredData.forEach((item, index) => {

            const content = `
                <div class="userBox" data-user-id=${item.Id}>
                    <div class="img-username">
                        <img src="../images/${item.Image}" alt="profile picture">
                        <span class="connected"></span>
                        <div class="user-message">
                            <h2>${item.Username}</h2>
                            <p>${item.LastMessage.String}</p>
                        </div>
                    </div>
                    <div class="time-msgNumber">
                        <div class="time">${getRightTime(parseInt(item.Time.String))}</div>
                        <span class="msgNmb">${item.UnreadMessages}</span>
                    </div>
                </div>
            `;
            chatBox.innerHTML += content;
            senderId = item.ConnectedUserId;
            const unreadMessage = document.querySelectorAll(".msgNmb")
            if(unreadMessage[index].textContent == "0") {
                unreadMessage[index].textContent = ""
            } else{
                unreadMessage[index].classList.add('unreadMessage')
            }
        });
        const allUsers = document.querySelectorAll('.userBox');
        console.log([...allUsers]);

        allUsers.forEach((user, index) => {
            user.addEventListener('click', async () => {
                console.log(`${filteredData[index].Username}`);
                messageContainer.innerHTML = '';
                messageContainer.style.cssText = `width: 70%;`;
                messageContainer.innerHTML = `
                    <div class="username-arrowLeft">
                        <i class="fa-solid fa-arrow-left"></i>
                        <div class="username">${filteredData[index].Username}</div>
                    </div>
                    <div class="messageBox">
                    </div>
                    <div class="inputContainer">
                        <input type="text" placeholder="Type your message...">
                        <input type="button" value="send">
                    </div>
                `;
                messageBox = document.querySelector('.messageBox');
                receiverId = filteredData[index].Id;
                let msgNbr = 0;
                console.log(receiverId, "jsnnnnn");
                await updateMessageState(receiverId)
                await fetchMessages(2, msgNbr, senderId, messageBox, messageContainer, socket);
                console.log(messageBox, "msg box");
    
                // if(messageBox){
                    console.log(messageBox, "msg boxtrr");
                    // Define the debounced scroll handler
                    const handleScroll = debounce(() => {
                        if (messageBox.scrollTop <= 5) {
                    console.log("Fetching more messages...");
                    fetchMessages(receiverId, msgNmb, senderId, messageBox, messageContainer);
                }
                }, 1000);
                messageBox.removeEventListener("scroll", handleScroll)
                    messageBox.addEventListener("scroll", handleScroll)
                // }
            });
        });
    } catch (error) {
        console.log("Error:", error);
    }
}


const updateMessageState = async(id) => {
    try{
        const response = await fetch('/api/messageState', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: id})
        })
        console.log(response)
    }catch(error) {
        console.log("statemeesage", error)
    }
}




const getRightTime = (time) => {
    const dateNow = new Date()
    const timeNow = Math.floor(dateNow.getTime()/1000)
    const date = convertTime(timeNow - time)
    if (isNaN(time)) {
        return ""
    }else if (timeNow - time >= 48*3600) {
        return `${date.day.toString().padStart(2, "0")}/${date.month.toString().padStart(2, "0")}/${date.year}`
    } else if(timeNow - time >= 24*3600) {
        return "yesterday"
    }
    return `${date.hours.toString().padStart(2, "0")}:${date.minutes.toString().padStart(2, "0")}`
}