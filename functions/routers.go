package functions

import (
	"fmt"
	"net/http"
)

func Routers() {
	http.HandleFunc("/home", Home)
	http.HandleFunc("/api/signUp/", SignUp)
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	fmt.Println("Server is running on www.localhost:8084/home")
	if err := http.ListenAndServe(":8084", nil); err != nil {
		fmt.Println("error in listen and serve!!")
	}
}
