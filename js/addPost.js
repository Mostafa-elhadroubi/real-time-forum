import { chat } from "./chat.js"
import { header } from "./header.js"
import { headerEvents } from "./home.js"

export const add_post = (app) => {
    const post = `
      <div class="addPostContainer">
        <form>
        <div class="categories">
            <div class="category">
                <input type="checkbox" name="categories" id="art" value="1">
                <label for="art">Art</label>
            </div>
            <div class="category">
                <input type="checkbox" name="categories" id="events" value="2">
                <label for="events">Events</label>
            </div>
            <div class="category">
                <input type="checkbox" name="categories" id="buisness" value="3">
                <label for="buisness">Buisness</label>
            </div>
            <div class="category">
                <input type="checkbox" name="categories" id="articles" value="4">
                <label for="articles">Articles</label>
            </div>
            <div class="category">
                <input type="checkbox" name="categories" id="others" value="5">
                <label for="others">Others</label>
            </div>
        </div>
        <div class="content">
            <h3>Title:</h3>
            <textarea name="title" id="" cols="30" rows="3"></textarea>
            <h3>Body:</h3>
            <textarea name="body" id="" cols="30" rows="6"></textarea>
        </div>
        <button type="submit" id="addPost">Add Post</button>
        </form>
    </div>
    `
    document.head.innerHTML = `<link rel="stylesheet" href="../css/home.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
`
    app.innerHTML = `
    ${header}
    ${post}
    `
    // chat()
    
    headerEvents()
    // document.head.innerHTML = ''
    const ul = document.querySelector('ul').childNodes[0]
    ul.innerHTML = ""
    ul.innerHTML = `<li><a href="/home"><i class="fa-solid fa-circle-plus"></i>Home</a></li>`
    // const addPostBtn = document.querySelector("#addPost")
    const formData = document.querySelector('form')
    formData.addEventListener('submit', async(e) => {
        e.preventDefault()
        const data = new FormData(formData)
        console.log(data);
        for (let [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }
        const response = await fetch("/api/addPost", {
            method: 'POST',
            body: data,
            
        })
        console.log(response);
        if(!response.ok) {
            const errorHTML = await response.text();
            document.body.innerHTML = errorHTML;
            return;
        }
        if (response.redirected) {
            window.location.href = response.url
        }
        
        

        
    })

}