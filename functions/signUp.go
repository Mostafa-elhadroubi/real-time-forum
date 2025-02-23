package functions

import (
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func setErrorCookie(res http.ResponseWriter, message, path string, maxAge int) {
	http.SetCookie(res, &http.Cookie{
		Name:   "errors",
		Value:  message,
		Path:   path,
		MaxAge: maxAge,
		// HttpOnly: true, // Secure the cookie, not accessible by JS
	})
}

func SignupAuth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseMultipartForm(10); err != nil {
		http.Error(w, "Unable to parse form data", http.StatusBadRequest)
	}

	username := strings.ToLower(r.FormValue("username"))
	age := r.FormValue("age")
	gender := r.FormValue("gender")
	firstName := r.FormValue("firstName")
	lastName := r.FormValue("lastName")
	email := strings.ToLower(r.FormValue("email"))
	password := r.FormValue("password")

	//regex
	emailRg := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	usernameRg := regexp.MustCompile(`^[a-zA-Z0-9-]{3,100}$`)
	if !usernameRg.MatchString(username) || !emailRg.MatchString(email) || len(email) > 100 ||
		len(username) > 50 || len(password) < 8 || len(password) > 100 {
		setErrorCookie(w, "Invalid Data!", "/signup", 2)
		http.Redirect(w, r, "/signup", http.StatusFound)
		return
	}

	//Hashing password
	pswd, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		setErrorCookie(w, "Unexpected error, try again", "/signup", 2)
		http.Redirect(w, r, "/signup", http.StatusFound)
		return
	}
	query := `SELECT username, email FROM users`
	rows, err := DB.Query(query)
	if err != nil {
		http.Error(w, "Unable to parse form data", http.StatusBadRequest)
		return
	}
	for rows.Next() {
		rows.Scan(&user.Username, &user.Email)
		if user.Username == username || user.Email == email {
			setErrorCookie(w, "Username or email already exists!", "/signup", 2)
			http.Redirect(w, r, "/signup", http.StatusFound)
			return
		}
	}
	query = `INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, 'profile.jpg', NULL, NULL, 0)`
	_, err = DB.Exec(query, username, firstName, lastName, age, gender, email, string(pswd))
	if err != nil {
		fmt.Println("insert into???")
		log.Fatalf("Error executing query: %v", err)
		setErrorCookie(w, "Invalid Data", "/signup", 2)
		http.Redirect(w, r, "/signup", http.StatusFound)
		return
	}
	setErrorCookie(w, "", "/signup", -1)
	http.Redirect(w, r, "/login", http.StatusFound)
}
