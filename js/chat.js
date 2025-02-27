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
    let arrUsers = []
    document.body.innerHTML = chat
    const chatBox = document.querySelector('.chatBox')
    fetch("/api/users/", {
        method: 'POST'
    })
    .then(response => {
        console.log(response)
        if(!response.ok) {
            console.log("Error fetching users", response.statusText)
            return
        }
        return response.json()
        // console.log(response)
    })
    .then(data => {
        chatBox.innerHTML = ''
        data.forEach(item => {
            let content = `
                <div class="userBox">
                    <div class="img-username">
                        <img src="../images/${item.Image}" alt="profile picture">
                        <span class="connected"></span>
                        <h2>${item.Username}</h2>
                    </div>
                    <div class="time-msgNumber">
                        <div class="time">yesterday</div>
                        <span>3</span>
                    </div>
                </div>
            `
            chatBox.innerHTML += content
        })
        arrUsers = data
        console.log(data)
        const allUsers = document.querySelectorAll('.userBox')
        const messageBox = document.querySelector('.messageBox')
        const messageContainer = document.querySelector('.messageContainer')
        console.log(allUsers)
        let lastIndexUser;
        allUsers.forEach((user, index) => {
            user.addEventListener('click', () => {
                console.log(`${data[index].Username}`)
                messageContainer.innerHTML = ''
               messageContainer.style.cssText = `width: 70%; border: 2px solid whitesmoke;`
                messageContainer.innerHTML = `
                                                <div class="username-arrowLeft">
                                                    <i class="fa-solid fa-arrow-left"></i>
                                                    <div class="username">${data[index].Username}</div>
                                                </div>
                                                <div class="messageBox">
                                                    <div class="sender">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:20</span>
                                                    </div>
                                                    <div class="receiver">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:21</span>
                                                    </div>
                                                    <div class="sender">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:22</span>
                                                    </div>
                                                    <div class="receiver">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:23</span>
                                                    </div>
                                                    <div class="sender">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:20</span>
                                                    </div>
                                                    <div class="receiver">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:21</span>
                                                    </div>
                                                    <div class="sender">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:22</span>
                                                    </div>
                                                    <div class="receiver">
                                                        <p>i send a message to a receiver.....</p>
                                                        <span>18:23</span>
                                                    </div>
                                                </div>
                                                <div class="inputContainer">
                                                    <input type="text" placeholder="Type your message...">
                                                    <input type="button" value="send">
                                                 </div>
                `
                lastIndexUser = index

            })
        })
    })
}