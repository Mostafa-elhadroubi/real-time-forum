import { debounce } from "./debounce.js";
import { msgNmb, fetchMessages, convertTime, isScrolled } from "./fetchMessages.js";
let receiverId;
export let messageBox
export let senderId;

export const fetchUsers = async() =>  {
    try {
        const response = await fetch("/api/users/", { method: 'POST' });
        if (response.redirected) {
            window.location.href = response.url; // Redirect to the login page
            return;
        }
        if (!response.ok) {
            const errorHTML = await response.text();
            document.body.innerHTML = errorHTML;
            return;
        }

        const data = await response.json();

        const filteredData = data.filter(item => item.ConnectedUserId !== item.Id);
        
        console.log(data)
        console.log(filteredData, "data")
        return filteredData
    } catch (error) {
        console.log("Error:", error);
    }
}


export const displayUsers = async(chatBox, messageContainer, socket) => {

    chatBox.innerHTML = '';
    const filteredData = await fetchUsers()
    filteredData.forEach((item, index) => {

        const content = `
            <div class="userBox" data-user-id=${item.Id}>
                <div class="img-username">
                    <img src="../images/${item.Image}" alt="profile picture">
                    <span class="connected"></span>
                    <div class="user-message">
                        <h2 class="username">${item.Username}</h2>
                        <p class="message"></p>
                    </div>
                </div>
                <div class="time-msgNumber">
                    <div class="time"></div>
                    <span class="msgNmb"></span>
                </div>
            </div>
        `;
        console.log(item)
        chatBox.innerHTML += content;
        senderId = item.ConnectedUserId;
        displayUnredMsg(index)
        // const unreadMessage = document.querySelectorAll(".msgNmb")
        // if(unreadMessage[index].textContent == "0") {
        //     unreadMessage[index].textContent = ""
        // } else{
        //     unreadMessage[index].classList.add('unreadMessage')
        // }
    });
    displayMessages(filteredData, socket, senderId)
   
}

export const displayMessages = (filteredData, socket, senderId) => {
    const chatContainer = document.querySelector('.chatContainer')
    
    const allUsers = document.querySelectorAll('.userBox');
    console.log([...allUsers]);
    allUsers.forEach((user, index) => {
        user.addEventListener('click', async () => {
            
            const allMsgContainer = document.querySelector('.messageContainer')
            if(allMsgContainer) {
                console.log(allMsgContainer);
                allMsgContainer.remove()
            }
            const messageContainer = document.createElement('div')
            messageContainer.classList.add('messageContainer')
            console.log(chatContainer, "rrrrr");
            chatContainer.appendChild(messageContainer)
            console.log(`${filteredData[index].Username}`);
            messageContainer.innerHTML = '';
            messageContainer.style.cssText = `width: 650px;`;
            messageContainer.innerHTML = `
                <div class="username-arrowLeft" id="goBack">
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
            await fetchMessages(receiverId, msgNbr, senderId, messageBox, messageContainer, socket);
            
            console.log(messageBox, "msg box");

            // if(messageBox){
                console.log(messageBox, "msg boxtrr");
                if(messageBox){
                // Define the debounced scroll handler
                    const handleScroll = debounce(() => {
                        
                        if (messageBox.scrollTop <= 5) {
                            console.log("Fetching more messages...");
                            fetchMessages(receiverId, msgNmb, senderId, messageBox, messageContainer);

                        }
                    }, 1000);
                    messageBox.removeEventListener("scroll", handleScroll)
                    messageBox.addEventListener("scroll", handleScroll)
            }
            const goBack = document.querySelector('#goBack')
            goBack.addEventListener('click', () => {
                if(allMsgContainer) {
                    allMsgContainer.remove()
                }
                
            })
        });
    });
}

export const displayUnredMsg = (index)=> {
    // senderId = item.ConnectedUserId;
    const unreadMessage = document.querySelectorAll(".msgNmb")
    console.log(unreadMessage);
    
    if(unreadMessage[index].textContent == "0") {
        unreadMessage[index].textContent = ""
    } else{
        unreadMessage[index].classList.add('unreadMessage')
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
        if(!response.ok) {
            const errorHTML = await response.text();
            document.body.innerHTML = errorHTML;
            return;
        }
    }catch(error) {
        console.log("statemeesage", error)
    }
}




export const getRightTime = (time) => {
    const dateNow = new Date()
    const timeNow = Math.floor(dateNow.getTime()/1000)
    const date = convertTime(time)
    if (isNaN(time)) {
        return ""
    }else if (timeNow - time >= 48*3600) {
        return `${date.day.toString().padStart(2, "0")}/${date.month.toString().padStart(2, "0")}/${date.year}`
    } else if(timeNow - time >= 24*3600) {
        return "yesterday"
    }
    return `${date.hours.toString().padStart(2, "0")}:${date.minutes.toString().padStart(2, "0")}`
}