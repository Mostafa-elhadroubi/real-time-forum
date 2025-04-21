import { debounce } from "./debounce.js";
import { msgNmb, fetchMessages, convertTime } from "./fetchMessages.js";
let receiverId;
// export let messageBox
export let senderId;
export const chatState = {
    senderId: null,
    receiverId: null,
    messageBox: null,
};

export const fetchUsers = async() =>  {
    try {
        const response = await fetch("/api/users/", { method: 'POST' });
        if (!response.ok) {
            let obj = await response.json()
            setError(obj.Message)  
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
        chatState.senderId = item.ConnectedUserId;
        
    });
    displayMessages(filteredData, socket)
   
}

export const displayMessages = (filteredData, socket) => {
    const chatContainer = document.querySelector('.chatContainer')
    
    const allUsers = document.querySelectorAll('.userBox');
    console.log([...allUsers]);
    allUsers.forEach((user, index) => {
        user.addEventListener('click', async () => {
            // const userBox = document.querySelector(`.userBox[data-user-id="${receiverId}"]`);
            console.log(user);
            chatState.receiverId = filteredData[index].Id
            if (user) {
                
                user.style.border = '';
                user.style.backgroundColor = '';
            }
            const oldMsgContainer = document.querySelector('.messageContainer')
            console.log(oldMsgContainer);
            
            if(oldMsgContainer) oldMsgContainer.remove()

            const messageContainer = document.createElement('div')
            messageContainer.classList.add('messageContainer')
            messageContainer.setAttribute('id', chatState.receiverId)
            console.log(chatState);
            
            console.log(chatContainer, "rrrrr");
            chatContainer.appendChild(messageContainer)
            console.log(`${filteredData[index].Username}`);
            messageContainer.innerHTML = '';
            messageContainer.style.cssText = `width: 650px;`;
            messageContainer.innerHTML = `
                <div class="username-arrowLeft goBack">
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
            chatState.messageBox = document.querySelector('.messageBox');
            chatState.senderId = filteredData[index].ConnectedUserId
            chatState.receiverId = filteredData[index].Id
            // receiverId = filteredData[index].Id;
            let msgNbr = 0;
            console.log(receiverId, "jsnnnnn");
            await updateMessageState(receiverId)
            await fetchMessages(chatState.receiverId, msgNbr, chatState.senderId, chatState.messageBox, messageContainer, socket);
            // const goBack = 
            console.log(chatState.messageBox, "msg box");

            // if(messageBox){
                console.log(chatContainer.messageBox, "msg boxtrr");
                if(chatState.messageBox){
                // Define the debounced scroll handler
                    const handleScroll = debounce(() => {
                        
                        if (chatState.messageBox.scrollTop <= 5) {
                            console.log("Fetching more messages...");
                            fetchMessages(chatState.receiverId, msgNmb, chatState.senderId, chatState.messageBox, messageContainer);

                        }
                    }, 1000);
                    chatState.messageBox.removeEventListener("scroll", handleScroll)
                    chatState.messageBox.addEventListener("scroll", handleScroll)
            }
            const goBack = document.querySelector('.goBack')
            goBack.addEventListener('click', () => {
                const oldMsgContainer = document.querySelector('.messageContainer');
                console.log(oldMsgContainer);
                
                if(oldMsgContainer) oldMsgContainer.remove()
                chatState.receiverId = null;
                chatState.messageBox = null;
            })
        });
    });
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
            let obj = await response.json()
            setError(obj.Message)  
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