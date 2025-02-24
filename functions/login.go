package functions

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gofrs/uuid"
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
		setErrorCookie(w, "Invalid credentials!", "/login", 5)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}
	token, err := uuid.NewV1()
	if err != nil {
		http.Error(w, "Error in generating a token", http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name: "token",
		Value: token.String(),
		Expires: time.Now().Add(tokenAge),
		Path: "/home",
	})
	query = `UPDATE users SET token = ?, token_exp = ?, isConnected = ? WHERE user_id = ?`
	_, err = DB.Exec(query, token, time.Now().Add(24*time.Hour).Unix(), 1, user.Id)
	if err != nil {
		setErrorCookie(w, "Unexpected error! Try Again", "/login", 5)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}
	user.Log = 1
	setErrorCookie(w, "", "/login", -1)
	http.Redirect(w, r, "/home", http.StatusFound)
}