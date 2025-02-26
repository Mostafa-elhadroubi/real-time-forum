package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func FetchUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	// token, err := r.Cookie("token")
	// if err != nil {
	// 	http.Error(w, "Bad Request", http.StatusBadRequest)
	// 	return
	// }
	// if !verifyToken(token.Value) {
	// 	http.Redirect(w, r, "/login", http.StatusFound)
	// }
	query := `SELECT user_id, username, image, isConnected FROM users`
	rows, err := DB.Query(query)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	allUser = []User{}
	for rows.Next() {
		rows.Scan(&user.Id, &user.Username, &user.Image, &user.Log)
		allUser = append(allUser, user)
	}
	jsonData, err := json.Marshal(allUser)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}
