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
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			http.Error(w, "Error upgrading connection:", http.StatusBadRequest)
			mu.Lock()
			delete(clients, user.Id)
			mu.Unlock()
			break
		}
		fmt.Printf("Received message: %s\n", msg)
		go storeMessage(w, user.Id, 2, string(msg))

		receiverID := 2
		mu.Lock()
		if conn, exists := clients[receiverID]; exists {
			if err := conn.WriteMessage(msgType, msg); err != nil {
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
