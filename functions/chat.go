package functions

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func FetchUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Println("request")
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	userId, err := GetUserFromSession(w, r)
	if err != nil {
		fmt.Println("Error in getting user id")
		http.Error(w, "Error in getting user id", http.StatusInternalServerError)
		return
	}
	if(userId == 0) {
		return
	}
	conversations := []Conversation{}
	query := `SELECT u.user_id, u.username, u.image, u.isConnected, m.message AS last_message, m.sent_at AS last_message_time, 
    COALESCE(unread_messages.unread_count, 0) AS unread_count FROM users u LEFT JOIN messages m ON m.message_id = (
    SELECT message_id FROM messages WHERE (receiver_id = u.user_id) ORDER BY sent_at DESC 
    LIMIT 1) LEFT JOIN (SELECT receiver_id AS user_id, COUNT(*) AS unread_count FROM messages WHERE isRead = 0 
     GROUP BY receiver_id) unread_messages ON u.user_id = unread_messages.user_id ORDER BY m.sent_at DESC LIMIT 100;`
	rows, err := DB.Query(query)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	fmt.Println(userId, "fetch user")
	for rows.Next() {
		con := Conversation{}
		var lastMessage sql.NullString
		var last_message_time sql.NullString
		err := rows.Scan(&con.Id, &con.Username, &con.Image, &con.IsConnected, &lastMessage, &last_message_time, &con.UnreadMessages)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		con.LastMessage = lastMessage
		con.Time = last_message_time
		if userId != con.Id {
			con.ConnectedUserId = userId
			conversations = append(conversations, con)
		}
	}
	// fmt.Println(conversations)
	jsonData, err := json.Marshal(conversations)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func GetUserFromSession(w http.ResponseWriter, r *http.Request) (int, error) {
	token, err := r.Cookie("token")
	if err != nil || token.Value == ""{
		fmt.Println("error in gettting token")
		// http.Redirect(w, r, "/login", http.StatusFound)
		return 0, fmt.Errorf("token not exists!")
	}
	var userId int
	query := "SELECT user_id FROM users WHERE token = ?"
	row := DB.QueryRow(query, token.Value)
	if err = row.Scan(&userId); err != nil {
		fmt.Println("Error scanning user ID", err)
		// http.Redirect(w, r, "/login", http.StatusFound)
		return 0, fmt.Errorf("invalid token")
	}
	fmt.Println("user id from session: ", userId)
	return userId, nil
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
	userId, err := GetUserFromSession(w, r)
	if err != nil {
		fmt.Println("Error in getting user id")
		http.Error(w, "Error in getting user id", http.StatusInternalServerError)
		return
	}
	fmt.Println(receiver.ReceiverId, "get it")
	fmt.Println(userId, "after hash")
	query := "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at DESC LIMIT 10 OFFSET ?"
	rows, err := DB.Query(query, userId, receiver.ReceiverId, receiver.ReceiverId, userId, receiver.MsgNbr)
	fmt.Println(receiver.MsgNbr, "msgnmb")
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer rows.Close()
	allMsg := []Messages{}
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
