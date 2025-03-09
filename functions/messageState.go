package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func UpdateMessageState(w http.ResponseWriter, r *http.Request) {
	query := "UPDATE messages SET isRead = ? WHERE receiver_id = ?"
	msg := UserStatus{}
	if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	fmt.Printf("UserID: %d, IsOnline: %v\n", msg.UserID)
	_, err := DB.Exec(query, 1, msg.UserID)
	if err != nil {
		http.Error(w, "Internal Server Error: Failed to execute database query", http.StatusInternalServerError)
		return
	}
}
