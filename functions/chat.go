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
		Error(w,http.StatusMethodNotAllowed)
		return
	}
	userId, err := GetUserFromSession(w, r)
	if err != nil {
		fmt.Println("Error in getting user id")
		Error(w,http.StatusInternalServerError)
		return
	}
	if(userId == 0) {
		return
	}
	conversations := []Conversation{}
	query := `SELECT 
    u.user_id, 
    u.username, 
    u.image, 
    m.sent_at AS last_message_time
FROM 
    users u
LEFT JOIN (
    SELECT 
        m1.message_id, 
        m1.message, 
        m1.sent_at,
        CASE 
            WHEN m1.sender_id = ? THEN m1.receiver_id
            ELSE m1.sender_id
        END AS other_user_id
    FROM 
        messages m1
    INNER JOIN (
        SELECT 
            MAX(sent_at) AS max_sent_at,
            CASE WHEN sender_id < receiver_id THEN sender_id ELSE receiver_id END AS user1,
            CASE WHEN sender_id < receiver_id THEN receiver_id ELSE sender_id END AS user2
        FROM 
            messages
        WHERE 
            ? IN (sender_id, receiver_id)
        GROUP BY 
            user1, user2
    ) latest ON 
        ((m1.sender_id = latest.user1 AND m1.receiver_id = latest.user2) OR
         (m1.sender_id = latest.user2 AND m1.receiver_id = latest.user1)) AND
        m1.sent_at = latest.max_sent_at
    WHERE 
        ? IN (m1.sender_id, m1.receiver_id)
) m ON u.user_id = m.other_user_id
ORDER BY 
    CASE WHEN m.message_id IS NULL THEN 1 ELSE 0 END ASC,
    COALESCE(m.sent_at, '1970-01-01') DESC,
    u.username ASC;`
	rows, err := DB.Query(query, userId, userId, userId)
	if err != nil {
		Error(w,http.StatusInternalServerError)
		return
	}
	fmt.Println(userId, "fetch user")
	for rows.Next() {
		con := Conversation{}
		// var lastMessage sql.NullString
		var last_message_time sql.NullString
		err := rows.Scan(&con.Id, &con.Username, &con.Image,  &last_message_time)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		// con.LastMessage = lastMessage
		con.Time = last_message_time
		if userId != con.Id {
			con.ConnectedUserId = userId
			conversations = append(conversations, con)
		}
	}
	fmt.Println(conversations)
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
		Error(w,http.StatusMethodNotAllowed)
		return
	}
	mu.Lock() // Lock the mutex to ensure exclusive access
	defer mu.Unlock()
	if err := json.NewDecoder(r.Body).Decode(&receiver); err != nil {
		
		Error(w,http.StatusInternalServerError)
		return
	}
	userId, err := GetUserFromSession(w, r)
	if err != nil {
		fmt.Println("Error in getting user id")
		Error(w,http.StatusInternalServerError)
		return
	}
	fmt.Println(receiver.ReceiverId, "get it")
	fmt.Println(userId, "after hash")
	query := "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at DESC LIMIT 10 OFFSET ?"
	rows, err := DB.Query(query, userId, receiver.ReceiverId, receiver.ReceiverId, userId, receiver.MsgNbr)
	fmt.Println(receiver.MsgNbr, "msgnmb")
	if err != nil {
		Error(w,http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	allMsg := []Messages{}
	for rows.Next() {
		if err := rows.Scan(&msg.Message_id, &msg.Sender_id, &msg.Receiver_id, &msg.Message, &msg.IsRead, &msg.Sent_at); err != nil {
			Error(w,http.StatusInternalServerError)
			return
		}
		allMsg = append(allMsg, msg)
	}
	fmt.Println(allMsg, "allmsg")
	jsonData, err := json.Marshal(allMsg)
	if err != nil {
		Error(w,http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)

}
