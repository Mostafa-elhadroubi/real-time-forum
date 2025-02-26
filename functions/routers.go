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

	http.HandleFunc("/logout", Logout)

	http.HandleFunc("/home", Home)
	http.HandleFunc("/api/users/", FetchUsers)
	http.HandleFunc("/chat", Home)

	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("images"))))
	
	fmt.Println("Server is running on www.localhost:8084/signup")
	if err := http.ListenAndServe(":8084", nil); err != nil {
		fmt.Println("error in listen and serve!!")
	}
}
