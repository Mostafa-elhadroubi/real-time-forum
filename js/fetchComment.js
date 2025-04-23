import { getRightTime } from "./fetchUsers.js";
import { setError } from "./home.js";

let commentState = {} 
export const fetchComment = async(item, index) => {
    let post_id = parseInt(item.parentElement.parentElement.getAttribute('id'))
    console.log(item.parentElement.parentElement.getAttribute('id'));

    if (!commentState[post_id]) {
        commentState[post_id] = {
            commentNum: 0,
            commentData: []
        }
    }

    const { commentNum, commentData } = commentState[post_id];
    const comments= document.querySelectorAll('.comments')
    // Hide comments of all other posts
    document.querySelectorAll('.comments').forEach((commentsDiv, idx) => {
        if (idx !== index) {
            commentsDiv.style.display= 'none';  // Hide comments for other posts
        }
    });

    // Show the clicked post's comments
    comments[index].style.display = 'block';
    const previousScrollHeight = comments[index].scrollHeight
    const commentResponse = await fetch("/api/comment", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({post_id: post_id, commentNum: commentNum})
    })
    console.log(commentResponse, commentNum);
    if(!commentResponse.ok) {
        let obj = await responseComment.json()
        setError(obj.Message)  
        return;
    }
    let data = await commentResponse.json()
    console.log(data);
    commentState[post_id].commentData = [...commentData, ...data];
    commentState[post_id].commentNum += data.length;


    data.forEach((item) => {
        const commentContainer = document.createElement('div');
        commentContainer.classList.add("commentContainer");
        commentContainer.innerHTML = `
            <div class="comment" id="${item.comment_id}">
                <img src="../images/${item.image}" alt="profile image">
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
        `;
    
        comments[index].insertBefore(commentContainer, comments[index].firstChild);
    
        // Get buttons
        const likeBtn = commentContainer.querySelector(".likeComment");
        const dislikeBtn = commentContainer.querySelector(".dislikeComment");
    
        // Set initial state
        if (item.user_reaction === "1") {
            likeBtn.querySelector("i").classList.replace("fa-regular", "fa-solid");
        }
        if (item.user_reaction === "0") {
            dislikeBtn.querySelector("i").classList.replace("fa-regular", "fa-solid");
        }
    
        // Like button event
        likeBtn.addEventListener("click", async () => {
            const res = await fetch("/api/likesComments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment_id: item.comment_id, like: 1 }),
            });
            if (!res.ok) {
                let obj =  res.json()
                setError(obj.Message)  
                return;
            }
    
            const liked = likeBtn.querySelector("i").classList.contains("fa-solid");
            if (liked) {
                likeBtn.querySelector("span").textContent = parseInt(likeBtn.querySelector("span").textContent) - 1;
                likeBtn.querySelector("i").classList.replace("fa-solid", "fa-regular");
            } else {
                likeBtn.querySelector("span").textContent = parseInt(likeBtn.querySelector("span").textContent) + 1;
                likeBtn.querySelector("i").classList.replace("fa-regular", "fa-solid");
                // Remove dislike if it exists
                if (dislikeBtn.querySelector("i").classList.contains("fa-solid")) {
                    dislikeBtn.querySelector("span").textContent = parseInt(dislikeBtn.querySelector("span").textContent) - 1;
                    dislikeBtn.querySelector("i").classList.replace("fa-solid", "fa-regular");
                }
            }
        });
    
        // Dislike button event
        dislikeBtn.addEventListener("click", async () => {
            const res = await fetch("/api/likesComments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment_id: item.comment_id, like: 0 }),
            });
            if (!res.ok) {
                let obj = await res.json()
                setError(obj.Message)  
                return;
            }
    
            const disliked = dislikeBtn.querySelector("i").classList.contains("fa-solid");
            if (disliked) {
                dislikeBtn.querySelector("span").textContent = parseInt(dislikeBtn.querySelector("span").textContent) - 1;
                dislikeBtn.querySelector("i").classList.replace("fa-solid", "fa-regular");
            } else {
                dislikeBtn.querySelector("span").textContent = parseInt(dislikeBtn.querySelector("span").textContent) + 1;
                dislikeBtn.querySelector("i").classList.replace("fa-regular", "fa-solid");
                // Remove like if it exists
                if (likeBtn.querySelector("i").classList.contains("fa-solid")) {
                    likeBtn.querySelector("span").textContent = parseInt(likeBtn.querySelector("span").textContent) - 1;
                    likeBtn.querySelector("i").classList.replace("fa-solid", "fa-regular");
                }
            }
        });
    
        const newScrollHeight = comments[index].scrollHeight;
        comments[index].scrollTop = newScrollHeight - previousScrollHeight - 10;
    });
}
