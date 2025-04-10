export const add_post = () => {
    const post = `
      <div class="addPostContainer">
        <form>
            <div class="add_category">
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
            <div class="content">
                <label>Title:</label>
                <textarea name="title" id="" cols="30" rows="10"></textarea>
                <label>Body:</label>
                <textarea name="body" id="" cols="30" rows="10"></textarea>
            </div>
            <button type="submit" id="addPost">Add Post</button>
        </form>
    </div>
    `
    document.body.innerHTML = post
    document.head.innerHTML = ''
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
        if (response.redirected) {
            window.location.href = response.url
        }
        
        

        
    })

}