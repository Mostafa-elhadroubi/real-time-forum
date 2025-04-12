import { getRightTime } from "./fetchUsers.js";
import { header } from "./header.js"
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
    const data = await postResponse.json()
    console.log(data);
    dataResponse = data
    const posts = document.querySelector('.posts')
    posts.innerHTML = ''
    data.forEach(item => {
        posts.innerHTML += `
            <div class="post" id="${item.post_id}">
               <div class="profile-info">
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
               <div class="title">${item.title}</div>
               
               <div class="body">${item.body}</div>
               <div class="btns">
                    <p class="like"><span>${item.liked}</span><i class="fa-regular fa-thumbs-up"></i></p>
                    <p class="dislike"><span>${item.disliked}</span><i class="fa-regular fa-thumbs-down"></i></p>
                    <p class="commentPost"><span></span><i class="fa-regular fa-comment"></i></p>
               </div>
               <div class="comments-writeComment">
                <div class="comments">
                    
                   
                </div>
                <div class="comment-btn">
                    <textarea name="comment" id=""></textarea>
                    <button>send</button>
                </div>
                
               </div>
            </div>
        `
    })
    const likes = document.querySelectorAll('.like')
    const dislikes = document.querySelectorAll('.dislike')
    console.log(likes, dislikes);
    likedOrDislikedPost(likes, dislikes, "1", 1)
    likedOrDislikedPost(dislikes, likes, "0", 0)
    const commentPost = document.querySelector('.commentPost')
    commentPost.addEventListener('click', async() => {
        fetchComment(commentPost)
    })
    

}
const fetchComment = async(commentPost) => {
    let post_id = parseInt(commentPost.parentElement.parentElement.getAttribute('id'))
    console.log(commentPost.parentElement.parentElement.getAttribute('id'));
    const commentResponse = await fetch("/api/comment", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({post_id: post_id})
    })
    console.log(commentResponse);
    let data = await commentResponse.json()
    console.log(data);
    commentData = data
    const comments = document.querySelector('.comments')
    comments.innerHTML = ''
    data.forEach(item => {
        comments.innerHTML += `
            <div class="comment" id="${item.comment_id}">
                <img src="../images/${item.image}" style="width:40px" alt="profile image">
                <div class="username-time">
                    <p>@${item.username}</p>
                    <p>${getRightTime(item.created_at)}</p>
                </div>
                <div class="commentBody">${item.body}</div>
                <div class="btnsComment">
                    <p class="likeComment"><span>${item.likedComment}</span><i class="fa-regular fa-thumbs-up"></i></p>
                    <p class="dislikeComment"><span>${item.dislikedComment}</span><i class="fa-regular fa-thumbs-down"></i></p>
                </div>
            </div>
        `
    })
    const likedComment = document.querySelectorAll('.likeComment')
    const dislikedComment = document.querySelectorAll('.dislikeComment')
    console.log(post_id, "dfgdfg");
    likedOrDislikedComment(likedComment, dislikedComment, "1", 1)
    likedOrDislikedComment(dislikedComment, likedComment, "0", 0)
    // likedComment.forEach((item, index) => {
    //     item.addEventListener('click', async() => {
    //         let comment_id = parseInt(item.parentElement.parentElement.getAttribute('id'))
    //         console.log(comment_id, "true");
    //         const reactionValue = 1
    //         const likeResponse = await fetch("/api/likesComments", {
    //             method: 'POST',
    //             headers: {'Content-Type' : 'application/json'},
    //             body: JSON.stringify({comment_id: comment_id, like : reactionValue})
    //         }) 
    //         console.log(likeResponse);
    //         if(item.childNodes[1].classList.contains("fa-solid")){
    //             if (parseInt(item.childNodes[0].textContent) != 0) {
    //                 item.childNodes[0].innerHTML = parseInt(item.childNodes[0].textContent) - 1
    //                 item.childNodes[1].classList.remove("fa-solid")
    //                 item.childNodes[1].classList.add("fa-regular")
    //             }
    //         } else {
    //             item.childNodes[0].innerHTML = parseInt(item.childNodes[0].textContent) + 1
    //             item.childNodes[1].classList.remove("fa-regular")
    //             item.childNodes[1].classList.add("fa-solid")
    //         }
    //         if (dislikes[index].childNodes[1].classList.contains("fa-solid")) {
    //             console.log(dislikes[index].childNodes[0]);
                
    //             dislikes[index].childNodes[0].innerHTML = parseInt(dislikes[index].childNodes[0].textContent) -1
    //             dislikes[index].childNodes[1].classList.remove("fa-solid")
    //             dislikes[index].childNodes[1].classList.add("fa-regular")  
    //         } 
    //     })
    // })
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
export const home = () => {
    const home = `
    <h1>Home</h1>
    `
    document.head.innerHTML = `<link rel="stylesheet" href="../css/home.css">
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    `
    const postBody = `
    <div class="post-chat-container">
    <div class="posts">
    
    <hr>
    </div>
    </div>
    `
    document.body.innerHTML = `
    ${header}
    ${postBody}
    `
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

