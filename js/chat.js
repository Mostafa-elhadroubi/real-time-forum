export const chat = () => {
    const chat = `
                <div class="chatContainer">
                    <div class="chatBox">
                        <div class="userBox">
                            <div class="img-username">
                                <img src="../images/profile.jpg" alt="profile picture">
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
                                <h2>username</h2>
                            </div>
                            <div class="time-msgNumber">
                                <div class="time">yesterday</div>
                                <span>3</span>
                            </div>
                        </div>
                    </div>
                    <div class="messageBox"></div>
                </div>           
    `
    document.body.innerHTML = chat
}