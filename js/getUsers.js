import { displayMessages, displayUnredMsg, fetchUsers, getRightTime } from "./fetchUsers.js"
let senderId = null
export const getUsers = async(sockets) =>{
    const usersArr = await fetchUsers()
    const div = document.createElement('div')
    div.classList.add('chatBox')
    const users = usersArr

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
        const h2 = document.createElement('h2')
        h2.textContent = `${user.Username}`
        const p = document.createElement('p')
        p.textContent = `${user.LastMessage.String}`
        userMessage.append(h2, p)
        imgUsername.append(img, span, userMessage)
        const timeMsgNumber = document.createElement('time-msgNumber')
        timeMsgNumber.classList.add('time-msgNumber')
        const time = document.createElement('div')
        time.classList.add('time')
        time.textContent = `${getRightTime(parseInt(user.Time.String))}`
        const msgNmb = document.createElement('span')
        msgNmb.classList.add('msgNmb')
        msgNmb.textContent = `${user.UnreadMessages}`
        timeMsgNumber.append(time, msgNmb)
        boxUser.setAttribute('data-user-id', user.Id)
        boxUser.append(imgUsername, timeMsgNumber)

        div.appendChild(boxUser)

}