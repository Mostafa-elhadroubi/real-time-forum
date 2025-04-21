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
	http.HandleFunc("/js/", AAA)
	http.HandleFunc("/css/", AAA)
	http.HandleFunc("/images/", AAA)
	// http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	// http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("images"))))
	
	fmt.Println("Server is running on http://localhost:8082/signup")
	if err := http.ListenAndServe(":8082", nil); err != nil {
		fmt.Println("error in listen and serve!!")
	}
}


func AAA(w http.ResponseWriter, r *http.Request) {
	// fmt.Println(r.URL.Path)
	fmt.Println("HHHHHHHHHHHHH")
	if r.URL.Path == "/js/" || r.URL.Path == "/css/" || r.URL.Path == "/images/" {
		w.WriteHeader(404)
		return
	}
	fmt.Println()
	http.ServeFile(w, r, "."+r.URL.Path)
	// ("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
}