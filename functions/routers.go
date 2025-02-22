package functions

import "net/http"

// func SignUp(w http.ResponseWriter, r *http.Request) {

// }
func Routers() {
	// http.HandleFunc("/signUp", SignUp) 
	http.HandleFunc("/home", Home)
	http.ListenAndServe(":8084", nil)
}

