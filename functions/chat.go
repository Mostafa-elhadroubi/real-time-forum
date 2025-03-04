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
	GetUserFromSession(w, r)
	query := `SELECT user_id, username, image, isConnected FROM users`
	rows, err := DB.Query(query)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	fmt.Println(user.Id, "fetch user")
	allUser = []User{}
	// tempId := user.Id
	user.ConnectedUserId = user.Id
	for rows.Next() {
		rows.Scan(&user.Id, &user.Username, &user.Image, &user.Log)
		allUser = append(allUser, user)
	}
	// user.Id = tempId
	user.Id = user.ConnectedUserId
	jsonData, err := json.Marshal(allUser)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserFromSession(w http.ResponseWriter, r *http.Request) {
	token, err := r.Cookie("token")
	if err != nil {
		fmt.Println("error in gettting token")
		http.Redirect(w, r, "/login", http.StatusFound)
	}
	query := "SELECT user_id FROM users WHERE token = ?"
	row := DB.QueryRow(query, token.Value)
	row.Scan(&user.Id)
}

func FetchMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	mu.Lock() // Lock the mutex to ensure exclusive access
	defer mu.Unlock()
	if err := json.NewDecoder(r.Body).Decode(&receiver); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	GetUserFromSession(w, r)
	fmt.Println(receiver.ReceiverId, "get it")
	fmt.Println(user.Id, "after hash")
	query := "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at DESC"
	rows, err := DB.Query(query, user.Id, receiver.ReceiverId, receiver.ReceiverId, user.Id)
	// fmt.Println(rows, "rows")
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer rows.Close()
	allMsg = []Messages{}
	for rows.Next() {
		if err := rows.Scan(&msg.Message_id, &msg.Sender_id, &msg.Receiver_id, &msg.Message, &msg.IsRead, &msg.Sent_at); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}
		allMsg = append(allMsg, msg)
	}
	fmt.Println(allMsg, "allmsg")
	jsonData, err := json.Marshal(allMsg)
	if err != nil {
		http.Error(w, "Error in marshling data", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)

}
