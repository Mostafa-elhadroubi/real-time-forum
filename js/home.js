import { getRightTime } from "./fetchUsers.js";
import { header } from "./header.js"
let postNum = 0

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
                    <p class="like">${item.like}<i class="fa-regular fa-thumbs-up"></i></p>
                    <p class="dislike">12<i class="fa-regular fa-thumbs-down"></i></p>
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
    const likes = document.querySelectorAll('.like i')
    const dislikes = document.querySelectorAll('.dislike i')
    console.log(likes, dislikes);
    likes.forEach((like, index) => {
        like.addEventListener('click', async() => {
            let post_id = parseInt(like.parentElement.parentElement.parentElement.getAttribute('id'))
            const likeValue = 1
            const likeResponse = await fetch("/api/likes", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({post_id: post_id, like : likeValue})
            }) 
            console.log(likeResponse);
            
            // console.log(like.parentElement.parentElement.parentElement.getAttribute('id'));
            like.classList.toggle("fa-regular")
            like.classList.toggle("fa-solid")
            dislikes[index].classList.remove("fa-solid")
            dislikes[index].classList.add("fa-regular")                    
        })
    })
    dislikes.forEach((dislike, index) => {
        dislike.addEventListener('click', () => {
            console.log('clicked');
            dislike.classList.toggle("fa-regular")
            dislike.classList.toggle("fa-solid")
            likes[index].classList.remove("fa-solid")
            likes[index].classList.add("fa-regular")
            pressDislike = 1
            pressLike = 0
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

