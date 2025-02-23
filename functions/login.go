package functions

import (
	"fmt"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Println("RRRRRRRRRRRRRR")
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	if err := r.ParseMultipartForm(10); err != nil {
		http.Error(w, "Unable to parse form data", http.StatusBadRequest)
	}
	username := strings.ToLower(r.FormValue("username"))
	password := r.FormValue("password")
	query := `SELECT user_id, username, email, password FROM users WHERE username = ? OR email = ?`
	row := DB.QueryRow(query, username, username)
	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.Password)
	if err != nil || bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))  != nil {
		setErrorCookie(w, "Invalid credentials!", "/login", 60)
		http.Redirect(w, r, "/login", http.StatusFound)
		return

	}
	fmt.Println(user)
	fmt.Println(username, password)

	// Id         int
	// Username   string
	// Email      string
	// Password   string
	// Token      any
	// Token_Exp  int
	// Image      string
	// Log        int
	// ErrorEmail string
}