import { chat, fetchOnlineUsers, onMessage } from "./chat.js";
import { debounce } from "./debounce.js";
import { fetchComment } from "./fetchComment.js";
import { chatState, displayMessages, fetchUsers, getRightTime } from "./fetchUsers.js";
import { getUsers } from "./getUsers.js";
import { header } from "./header.js"
import { likedOrDislikedPost } from "./likePost.js";
import { navigateTo } from "./main.js";
import { updateUserStatus } from "./sendMessages.js";
let sockets = null

let commentNum = 0
let postNum = 0
export let dataResponse = []
// key: post_id, value: { commentNum: int, commentData: [] }

const fetchPosts = async() => {
    const postResponse = await fetch("/api/posts", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({postNum:postNum})
    })
    console.log(postResponse);
    if(!postResponse.ok) {
        let obj = await postResponse.json()
        setError(obj.Message)  
        return;
    }
    const data = await postResponse.json()
    console.log(data);
    dataResponse = data
    const posts = document.querySelector('.posts')
    posts.innerHTML = ''
    data.forEach(item => {
        posts.innerHTML += `
            <div class="post" id="${item.post_id}">
               <div class="profile-info comment-profile">
                    <img src="../images/${item.image}" style="width:40px" alt="profile image"> 
                    <div class="username-time">
                        <p>@${item.username}</p>
                        <p>${getRightTime(parseInt(item.created_at))}</p>
                    </div>
               </div>
               <div class="categories">
                    <h3>Categories:</h3>
                    <p>${item.categories}</p>

               </div>
               <h3 class="h3">Title:</h3>
               
               <h3 class="h3">Body:</h3>

               <div class="btns">
                    <p class="like"><span>${item.liked}</span><i class="fa-regular fa-thumbs-up"></i></p>
                    <p class="dislike"><span>${item.disliked}</span><i class="fa-regular fa-thumbs-down"></i></p>
                    <p class="commentPost"><span>${item.totalComments}</span><i class="fa-regular fa-comment"></i></p>
               </div>
               <div class="comments-writeComment">
                <div class="comments">                   
                </div>
                <div class="comment-btn">
                    <textarea name="comment" class="bodyComment"></textarea>
                    <button class="sendComment">send</button>
                </div>
                
               </div>
            </div>
            <hr>
        `

        // After the HTML is injected, find the last .post just added
    const lastPost = posts.querySelector('.post:last-of-type');

    // Create .title div
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = item.title;

    // Create .postBody div
    const postBodyDiv = document.createElement('div');
    postBodyDiv.classList.add('postBody');
    postBodyDiv.textContent = item.body;

    // Find the right <h3> labels
    const h3s = lastPost.querySelectorAll('h3.h3');
    const titleH3 = h3s[0];
    const bodyH3 = h3s[1];

    // Insert title/body right after their labels
    titleH3.insertAdjacentElement('afterend', titleDiv);
    bodyH3.insertAdjacentElement('afterend', postBodyDiv);
    })
    const likes = document.querySelectorAll('.like')
    const dislikes = document.querySelectorAll('.dislike')
    console.log(likes, dislikes);
    likedOrDislikedPost(likes, dislikes, "1", 1)
    likedOrDislikedPost(dislikes, likes, "0", 0)
    const sendComment = document.querySelectorAll('.sendComment')
    sendComment.forEach((item, index) => {
        console.log(index);
        
        item.addEventListener('click', async() => {
            const post_id = parseInt(item.parentElement.parentElement.parentElement.getAttribute('id'));
            let body_comment = document.querySelectorAll('.bodyComment')[index].value
            console.log(body_comment);
            const responseComment = await fetch("/api/addComment", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({post_id: post_id, contentBody: body_comment})
            })
            //console.log(await responseComment.json());
            if(responseComment.ok) {
                document.querySelectorAll('.bodyComment')[index].value = "";
                console.log(document.querySelectorAll('.commentPost')[index].childNodes[0].textContent, "hhhh");
                
                let totalComment = parseInt(document.querySelectorAll('.commentPost')[index].childNodes[0].textContent)
                totalComment++
                console.log(totalComment);
                
                document.querySelectorAll('.commentPost')[index].childNodes[0].innerHTML = totalComment;
            } else {
                console.log("e777777777777777777rror");
                
                let obj = await responseComment.json()
                setError(obj.Message)  
                return;
            }  
        })

    })
    const fetchCommentPost = document.querySelectorAll('.commentPost')
    fetchCommentPost.forEach((item, index) => {
        item.addEventListener('click', async() => {
            console.log(item);
            const comments = document.querySelectorAll('.comments')
            fetchComment(item, index)
            const handleScroll = debounce(() => {
                if(comments[index].scrollTop < 5) {
                    console.log(commentNum);
                    
                    fetchComment(item,index)
                }
            },1000)
            comments[index].addEventListener('scroll', handleScroll)
        })

    })
    

}


export const home = async(app) => {
    document.head.innerHTML = `<link rel="stylesheet" href="../css/home.css">
                                <link rel="stylesheet" href="../css/chat.css">
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    `
    const postBody = `
    <div class="post-chat-container">
        <div class="chatContainer">
        
        </div>
        <div class="posts">
        
        <hr>
        </div>
    </div>
    `
    connectSocket() 
    const { usersEl, usersArr } = await getUsers(sockets);
    console.log(usersEl, "nnnn");
    console.log(usersArr);
    
    app.innerHTML = `
    ${header}

    ${postBody}
    `

    app.querySelector('.chatContainer').insertAdjacentElement("afterbegin", usersEl);
    headerEvents()
    
    console.log(await fetchUsers(), "ttttttt");
    console.log(usersArr, "users");
    if(usersArr.length != 0) {
        chatState.senderId = usersArr[0].ConnectedUserId
        displayMessages(usersArr, sockets)
    }
    fetchPosts()
    console.log(usersArr);
    
}


const connectSocket = () => {
    const socket = new WebSocket("ws://localhost:8082/ws")
    // aaaaa()
    console.log("socket");
    
    // When the WebSocket connection is open
    socket.onopen = function(event) {
        console.log("WebSocket connection established.");
        if(sockets == null) {

            sockets = socket
            console.log(sockets);
            fetchOnlineUsers()
        }
        
        socket.onmessage = (event) => {
                onMessage(event)
        }

        socket.onclose = (event) => {
            console.log("Websocket connection is closed!")
            console.log(chatState);
            
            sockets = null
            updateUserStatus(chatState.senderId, false)
        }
   
    };
}


export const headerEvents = () => {
    const addpost = document.querySelector("#addpost")
    addpost.addEventListener('click', () => {
        navigateTo("/addPost")
    })
    const chat = document.querySelector("#chat")
    chat.addEventListener('click', () => {
        navigateTo("/chat")
    })
    const logout = document.querySelector("#logout")
    logout.addEventListener('click', () => {
        if (sockets && sockets.readyState === WebSocket.OPEN) {
            sockets.close()
        }
    
        navigateTo("/logout")
    })
    const homeBtn = document.querySelector('#image')
    homeBtn.addEventListener('click', () => {
        navigateTo("/home")
    })
    
}



export const setError = (ms) => {
    console.log("error");
    const msg = document.createElement('div')
    msg.classList.add('msgError')
    const pmsg = document.createElement('p')
    pmsg.textContent = ms
    msg.appendChild(pmsg)
    document.body.appendChild(msg)
    setTimeout(() => {
        msg.remove()
    }, 3000)

}