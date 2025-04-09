import { header } from "./header.js"

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
            <div class="post">
               <div class="profile-info">
                    <img src="" alt="profile image"> 
                    <div class="username-time">
                        <p>@username</p>
                        <p>25 min ago</p>
                    </div>
               </div>
               <div class="categories">
                    <p>Evetns</p>
                    <p>Buisness</p>
               </div>
               <div class="title">title</div>
               
               <div class="body">body content</div>
               <div class="btns">
                    <p>12<i class="fa-regular fa-thumbs-up"></i></p>
                    <p>12<i class="fa-regular fa-thumbs-down"></i></p>
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
const postNum = 0
const fetchPosts = async() => {
    const postResponse = await fetch("/api/posts", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(postNum)
    })
    console.log(postResponse);
    const data = postResponse.json()
    console.log(data);
    
    
}