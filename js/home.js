import { getRightTime } from "./fetchUsers.js";
import { header } from "./header.js"
let postNum = 0
let dataResponse = []
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
                    <p>12<i class="fa-regular fa-comment"></i></p>
               </div>
               <div class="comments-writeComment">
                <div class="comments">
                    <div class="comment">
                        <img src="" alt="profile image">
                        <div class="username-time">
                            <p>@username</p>
                            <p>25 min ago</p>
                        </div>
                        <div class="commentBody">my first comment</div>
                    </div>
                    <div class="comment">
                        <img src="" alt="profile image">
                        <div class="username-time">
                            <p>@username</p>
                            <p> 1h ago</p>
                        </div>
                        <div class="commentBody">my second comment</div>
                    </div>
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
    likes.forEach((like, index) => {

        
        
        if (dataResponse[index].user_reaction == '1') {
            like.childNodes[1].classList.remove("fa-regular")
            like.childNodes[1].classList.add("fa-solid")
        }
        like.addEventListener('click', async() => {
            console.log(like.parentElement.parentElement);
            
            let post_id = parseInt(like.parentElement.parentElement.getAttribute('id'))
            console.log(post_id);
            
            const likeValue = 1
            const likeResponse = await fetch("/api/likes", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({post_id: post_id, like : likeValue})
            }) 
            console.log(likeResponse);
            if(like.childNodes[1].classList.contains("fa-solid")){
                if (parseInt(like.childNodes[0].textContent) != 0) {
                    like.childNodes[0].innerHTML = parseInt(like.childNodes[0].textContent) - 1
                    like.childNodes[1].classList.remove("fa-solid")
                    like.childNodes[1].classList.add("fa-regular")
                }
            } else {
                like.childNodes[0].innerHTML = parseInt(like.childNodes[0].textContent) + 1
                like.childNodes[1].classList.remove("fa-regular")
                like.childNodes[1].classList.add("fa-solid")
            }
            console.log(dislikes[index].childNodes[1]);
            if (dislikes[index].childNodes[1].classList.contains("fa-solid")) {
                console.log(dislikes[index].childNodes[0]);
                
                dislikes[index].childNodes[0].innerHTML = parseInt(dislikes[index].childNodes[0].textContent) -1
                dislikes[index].childNodes[1].classList.remove("fa-solid")
                dislikes[index].childNodes[1].classList.add("fa-regular")  
            }
            
                              
        })
    })
    dislikes.forEach((dislike, index) => {
        if (dataResponse[index].user_reaction == '0') {
            dislike.childNodes[1].classList.remove("fa-regular")
            dislike.childNodes[1].classList.add("fa-solid")
        }
        
        
        // console.log(likes[index].childNodes[1]);
        dislike.addEventListener('click', async() => {
            let post_id = parseInt(dislike.parentElement.parentElement.getAttribute('id'))
            const dislikeValue = 0
            const likeResponse = await fetch("/api/likes", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({post_id: post_id, like : dislikeValue})
            }) 
            console.log(likeResponse);
            console.log(dislike);
            
            if(dislike.childNodes[1].classList.contains("fa-solid")){
                if (parseInt(dislike.childNodes[0].textContent) != 0) {
                    dislike.childNodes[0].innerHTML = parseInt(dislike.childNodes[0].textContent) - 1
                    dislike.childNodes[1].classList.remove("fa-solid")
                    dislike.childNodes[1].classList.add("fa-regular")
                }
            } else {
                dislike.childNodes[0].innerHTML = parseInt(dislike.childNodes[0].textContent) + 1
                dislike.childNodes[1].classList.remove("fa-regular")
                dislike.childNodes[1].classList.add("fa-solid")
            }

            if (likes[index].childNodes[1].classList.contains("fa-solid")) {
                likes[index].childNodes[0].innerHTML = parseInt(likes[index].childNodes[0].textContent) -1
                likes[index].childNodes[1].classList.remove("fa-solid")
                likes[index].childNodes[1].classList.add("fa-regular")
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
    // likeOrDislike()
}

// const likeOrDislike = () => {
//     const likes = document.querySelectorAll('.like')
//     const dislikes = document.querySelectorAll('.dislike')
//     console.log(likes, dislikes);
    
// }

