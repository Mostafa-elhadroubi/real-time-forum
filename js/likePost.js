import { dataResponse, setError } from "./home.js"

export const likedOrDislikedPost = (likes, dislikes, user_reaction, reactionValue) => {
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
                let obj = await likeResponse.json()
                setError(obj.Message)  
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