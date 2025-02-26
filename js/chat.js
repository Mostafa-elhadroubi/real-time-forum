export const chat = () => {
    const chat = `
                <div class="chatContainer">
                    <div class="chatBox">
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                        
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
                                <span class="connected"></span>
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                    </div>
                    <div class="messageBox">
                        <div class="username-arrowLeft">
                            <i class="fa-solid fa-arrow-left"></i>
                            <div>username</div>
                        </div>
                        <div class="messageContainer">
                            <div class="sender">
                                <p>i send a message to a receiver.....</p>
                                <span>18:20</span>
                            </div>
                            <div class="receiver">
                                <p>i send a message to a receiver.....</p>
                                <span>18:21</span>
                            </div>
                            <div class="sender">
                                <p>i send a message to a receiver.....</p>
                                <span>18:22</span>
                            </div>
                            <div class="receiver">
                                <p>i send a message to a receiver.....</p>
                                <span>18:23</span>
                            </div>
                            <div class="sender">
                                <p>i send a message to a receiver.....</p>
                                <span>18:20</span>
                            </div>
                            <div class="receiver">
                                <p>i send a message to a receiver.....</p>
                                <span>18:21</span>
                            </div>
                            <div class="sender">
                                <p>i send a message to a receiver.....</p>
                                <span>18:22</span>
                            </div>
                            <div class="receiver">
                                <p>i send a message to a receiver.....</p>
                                <span>18:23</span>
                            </div>
                        </div>
                        <div class="inputContainer">
                            <input type="text" placeholder="Type your message...">
                            <input type="button" value="send">
                        </div>
                    </div>
                </div>           
    `
    document.head.innerHTML = `<link rel="stylesheet" href="../css/chat.css">
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    `
    document.body.innerHTML = chat
    const allUsers = document.querySelectorAll('.userBox')
    console.log(allUsers)
    allUsers.forEach(user => {
        user.addEventListener('click', () => {

        })
    })
}