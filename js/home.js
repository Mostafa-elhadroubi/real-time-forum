import { chat, fetchOnlineUsers, onMessage } from "./chat.js";
import { displayMessages, fetchUsers, getRightTime } from "./fetchUsers.js";
import { getUsers } from "./getUsers.js";
import { header } from "./header.js"
import { socket } from "./login.js";
import { navigateTo } from "./main.js";
let sockets = null

let senderId = null
let postNum = 0
let dataResponse = []
let commentData = []
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
        const errorHTML = await postResponse.text();
        document.body.innerHTML = errorHTML;
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
               <div class="title">${item.title}</div>
               
               <h3 class="h3">Body:</h3>
               <div class="postBody">${item.body}</div>
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
                    <button id="sendComment">send</button>
                </div>
                
               </div>
            </div>
            <hr>
        `
    })
    const likes = document.querySelectorAll('.like')
    const dislikes = document.querySelectorAll('.dislike')
    console.log(likes, dislikes);
    likedOrDislikedPost(likes, dislikes, "1", 1)
    likedOrDislikedPost(dislikes, likes, "0", 0)
    // sendCommentPost()
    const sendComment = document.querySelectorAll('#sendComment')
    sendComment.forEach((item, index) => {
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
            console.log(responseComment);
            if(responseComment.ok) {
                document.querySelectorAll('.bodyComment')[index].value = "";
                console.log(document.querySelectorAll('.commentPost')[index].childNodes[0].textContent, "hhhh");
                
                let totalComment = parseInt(document.querySelector('.commentPost').childNodes[0].textContent)
                totalComment++
                document.querySelector('.commentPost').childNodes[0].innerHTML = totalComment;
            } else {
                const errorHTML = await responseComment.text(); // get the HTML from Go server
                document.body.innerHTML = errorHTML;     // display it manually
                return;
            }  
        })

    })
    const fetchCommentPost = document.querySelector('.commentPost')
    fetchCommentPost.addEventListener('click', async() => {
        fetchComment(fetchCommentPost)
    })
    

}
const fetchComment = async(fetchCommentPost) => {
    let post_id = parseInt(fetchCommentPost.parentElement.parentElement.getAttribute('id'))
    console.log(fetchCommentPost.parentElement.parentElement.getAttribute('id'));
    const commentResponse = await fetch("/api/comment", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({post_id: post_id})
    })
    console.log(commentResponse);
    if(!commentResponse.ok) {
        const errorHTML = await commentResponse.text();
        document.body.innerHTML = errorHTML;
        return;
    }
    let data = await commentResponse.json()
    console.log(data);
    commentData = data
    const comments = document.querySelector('.comments')
    comments.innerHTML = ''
    data.forEach(item => {
        comments.innerHTML += `
            <div class="comment" id="${item.comment_id}">
                <img src="../images/${item.image}"  alt="profile image">
                <div class="username-time">
                    <p>@${item.username}</p>
                    <p>${getRightTime(item.created_at)}</p>
                </div>
            </div>
            <div class="commentBody">${item.body}</div>
                <div class="btnsComment">
                    <p class="likeComment"><span>${item.likedComment}</span><i class="fa-regular fa-thumbs-up"></i></p>
                    <p class="dislikeComment"><span>${item.dislikedComment}</span><i class="fa-regular fa-thumbs-down"></i></p>
                </div>
        `
    })
    const likedComment = document.querySelectorAll('.likeComment')
    const dislikedComment = document.querySelectorAll('.dislikeComment')
    console.log(post_id, "dfgdfg");
    likedOrDislikedComment(likedComment, dislikedComment, "1", 1)
    likedOrDislikedComment(dislikedComment, likedComment, "0", 0)
}
const likedOrDislikedComment = async(likes, dislikes, user_reaction, reactionValue) => {
    likes.forEach((item, index) => {
        if (commentData[index].user_reaction == user_reaction) {
            item.childNodes[1].classList.remove("fa-regular")
            item.childNodes[1].classList.add("fa-solid")
        }
        item.addEventListener('click', async() => {            
            let comment_id = parseInt(item.parentElement.parentElement.getAttribute('id'))
            console.log(comment_id);
            
            const likeResponse = await fetch("/api/likesComments", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({comment_id: comment_id, like : reactionValue})
            }) 
            console.log(likeResponse);
            if(!likeResponse.ok) {
                const errorHTML = await likeResponse.text();
                document.body.innerHTML = errorHTML;
        return;
            }
            if(item.childNodes[1].classList.contains("fa-solid")){
                if (parseInt(item.childNodes[0].textContent) != 0) {
                    item.childNodes[0].innerHTML = parseInt(item.childNodes[0].textContent) - 1
                    item.childNodes[1].classList.remove("fa-solid")
                    item.childNodes[1].classList.add("fa-regular")
                }
            } else {
                item.childNodes[0].innerHTML = parseInt(item.childNodes[0].textContent) + 1
                item.childNodes[1].classList.remove("fa-regular")
                item.childNodes[1].classList.add("fa-solid")
            }
            if (dislikes[index].childNodes[1].classList.contains("fa-solid")) {
                console.log(dislikes[index].childNodes[0]);
                
                dislikes[index].childNodes[0].innerHTML = parseInt(dislikes[index].childNodes[0].textContent) -1
                dislikes[index].childNodes[1].classList.remove("fa-solid")
                dislikes[index].childNodes[1].classList.add("fa-regular")  
            }                               
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
    senderId = usersArr[0].ConnectedUserId
    console.log(usersArr);
    
    displayMessages(usersArr, sockets)
    fetchPosts()
}

const likedOrDislikedPost = (likes, dislikes, user_reaction, reactionValue) => {
    likes.forEach((item, index) => {
        if (dataResponse[index].user_reaction == user_reaction) {
            item.childNodes[1].classList.remove("fa-regular")
            item.childNodes[1].classList.add("fa-solid")
        }
        item.addEventListener('click', async() => {            
            let post_id = parseInt(item.parentElement.parentElement.getAttribute('id'))
            const likeResponse = await fetch("/api/likes", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({post_id: post_id, like : reactionValue})
            }) 
            console.log(likeResponse);
            if(!likeResponse.ok) {
                const errorHTML = await postResponse.text();
                document.body.innerHTML = errorHTML;
                return;
            }
            if(item.childNodes[1].classList.contains("fa-solid")){
                if (parseInt(item.childNodes[0].textContent) != 0) {
                    item.childNodes[0].innerHTML = parseInt(item.childNodes[0].textContent) - 1
                    item.childNodes[1].classList.remove("fa-solid")
                    item.childNodes[1].classList.add("fa-regular")
                }
            } else {
                item.childNodes[0].innerHTML = parseInt(item.childNodes[0].textContent) + 1
                item.childNodes[1].classList.remove("fa-regular")
                item.childNodes[1].classList.add("fa-solid")
            }
            if (dislikes[index].childNodes[1].classList.contains("fa-solid")) {
                console.log(dislikes[index].childNodes[0]);
                
                dislikes[index].childNodes[0].innerHTML = parseInt(dislikes[index].childNodes[0].textContent) -1
                dislikes[index].childNodes[1].classList.remove("fa-solid")
                dislikes[index].childNodes[1].classList.add("fa-regular")  
            }                               
        })
    })
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
        navigateTo("/logout")
    })
    const homeBtn = document.querySelector('#image')
    homeBtn.addEventListener('click', () => {
        navigateTo("/home")
    })
    
}