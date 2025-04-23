package functions

import (
	"fmt"
	"net/http"
)

func Routers() {
	http.HandleFunc("/signup", Home)
	http.HandleFunc("/api/signup/", SignupAuth)

	http.HandleFunc("/login", Home)
	http.HandleFunc("/api/login/", Login)

	http.HandleFunc("/api/addPost", AddPost)
	http.HandleFunc("/api/posts", FetchPosts)

	http.HandleFunc("/api/likes", Likes)
	http.HandleFunc("/api/comment", Comments)
	http.HandleFunc("/api/likesComments", LikesComments)
	http.HandleFunc("/api/addComment", AddComment)

	http.HandleFunc("/logout", Logout)
	http.HandleFunc("/checkLogin", CheckLogin)

	http.HandleFunc("/", Home)
	http.HandleFunc("/api/users/", FetchUsers)
	http.HandleFunc("/chat", Home)
	http.HandleFunc("/api/messageState", UpdateMessageState)
	http.HandleFunc("/getOnlineUsers", GetOnlineUsers)

	// WebSocket endpoint
	http.HandleFunc("/ws", HandleConnections) // The WebSocket handler

	http.HandleFunc("/api/messages/", FetchMessages)
	http.HandleFunc("/js/", Static)
	http.HandleFunc("/css/", Static)
	http.HandleFunc("/images/", Static)
	
	fmt.Println("Server is running on http://localhost:8082/signup")
	if err := http.ListenAndServe(":8082", nil); err != nil {
		fmt.Println("error in listen and serve!!")
	}
}


