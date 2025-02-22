package functions

import (
	"fmt"
	"net/http"
)

func SignUp(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10); err != nil {
		http.Error(w, "Unaable to parse form data", http.StatusBadRequest)
	}

	username := r.FormValue("username")
	age := r.FormValue("age")
	gender := r.FormValue("gender")
	firstName := r.FormValue("firstName")
	lastName := r.FormValue("lastName")
	email := r.FormValue("email")
	password := r.FormValue("password")

	fmt.Printf("Received signup data:\n")
	fmt.Printf("Username: %s\n", username)
	fmt.Printf("Age: %s\n", age)
	fmt.Printf("Gender: %s\n", gender)
	fmt.Printf("First Name: %s\n", firstName)
	fmt.Printf("Last Name: %s\n", lastName)
	fmt.Printf("Email: %s\n", email)
	fmt.Printf("Password: %s\n", password)

}
