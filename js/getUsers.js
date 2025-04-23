import { fetchUsers, getRightTime } from "./fetchUsers.js"
let senderId = null
export const getUsers = async(sockets) =>{
    const usersArr = await fetchUsers()
    const div = document.createElement('div')
    div.classList.add('chatBox')
    const users = usersArr
    console.log(users);
    
    users.forEach((user) => {
        createChatBox(div, user)
    })
    console.log(div);

    return { usersEl: div, usersArr }
}
const createChatBox = (div, user) => {
    const boxUser = document.createElement('div')
        boxUser.classList.add('userBox')
        const imgUsername = document.createElement('div')
        imgUsername.classList.add('img-username')
        const img = document.createElement('img')
        img.src = `../images/${user.Image}`
        const span = document.createElement('span')
        span.classList.add('connected')
        const userMessage = document.createElement('div')
        userMessage.classList.add("user-message")
        const h2 = document.createElement('h2')
        h2.textContent = `${user.Username}`
        h2.classList.add('username')
        const p = document.createElement('p')
        p.classList.add('message')
        userMessage.append(h2, p)
        imgUsername.append(img, span, userMessage)
        const timeMsgNumber = document.createElement('div')
        timeMsgNumber.classList.add('time-msgNumber')
        const time = document.createElement('div')
        time.classList.add('time')
        const msgNmb = document.createElement('span')
        msgNmb.classList.add('msgNmb')
        timeMsgNumber.append(time, msgNmb)
        boxUser.setAttribute('data-user-id', user.Id)
        boxUser.append(imgUsername, timeMsgNumber)

        div.appendChild(boxUser)
        console.log(userMessage);
        

}