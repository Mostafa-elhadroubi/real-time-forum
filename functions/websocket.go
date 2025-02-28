package functions

import (
	"fmt"
	"net/http"
	"time"
)

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Error upgrading connection:", http.StatusBadRequest)
		return
	}
	defer conn.Close()
	mu.Lock()
	clients[user.Id] = conn
	mu.Unlock()

	for {
		if err := conn.ReadJSON(&wsMsg); err != nil {
			http.Error(w, "Error reading message", http.StatusBadRequest)
			delete(clients, user.Id)
			break
		}
		mu.Lock()
		fmt.Printf("Received message: %s\n", msg)
		go storeMessage(w, wsMsg.Sender_id, wsMsg.Receiver_id, wsMsg.Text)
		mu.Unlock()
		mu.Lock()
		if conn, exists := clients[wsMsg.Receiver_id]; exists {
			if err := conn.WriteJSON(wsMsg); err != nil {
				http.Error(w, "Error upgrading connection:", http.StatusBadRequest)
				return
			}
		}
		mu.Unlock()
	}
}

func storeMessage(w http.ResponseWriter, senderID, receiverID int, msg string){
	query := "INSERT INTO messages VALUES(NULL, ?, ?, ?,?)"
	_, err := DB.Exec(query, senderID, receiverID, msg, time.Now().Unix())
	if err != nil {
		http.Error(w, "Error upgrading connection:", http.StatusBadRequest)
		return
	}
}
