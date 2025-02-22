package functions

import (
	"fmt"
	"net/http"
)

// func SignUp(w http.ResponseWriter, r *http.Request) {

// }
func Routers() {
	// http.HandleFunc("/signUp", SignUp)
	http.HandleFunc("/home", Home)
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	fmt.Println("Server is running on www.localhost:8084/home")
	if err := http.ListenAndServe(":8084", nil); err != nil {
		fmt.Println("error in listen and serve!!")
	}
}
