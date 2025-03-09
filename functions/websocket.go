package functions

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

func userStatus(userId int, isOnline bool) {
	mu.Lock()
	fmt.Println(userId, "userstate")
	userState := UserStatus{}
	userState.UserID = userId
	userState.IsOnline = isOnline
	for id, conn := range clients {
		if id != userId {
			if err := conn.WriteJSON(userState); err != nil {
				log.Println("Error broadcasting user status:", err)
			}
		}
	}
	mu.Unlock()
}
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}
	defer conn.Close()
	mu.Lock()
	clients[user.Id] = conn
	mu.Unlock()
	
	userStatus(user.Id, true)
	for {
		if err := conn.ReadJSON(&wsMsg); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed:", err)
			} else {
				log.Println("Error reading message:", err)
			}
			mu.Lock()
			delete(clients, user.Id)
			mu.Unlock()
			userStatus(user.Id, false)
			break
		}
		fmt.Printf("Received message: %s\n", msg)
		if storeMessage(wsMsg.Sender_id, wsMsg.Receiver_id, wsMsg.Text){
			mu.Lock()
			if conn, exists := clients[wsMsg.Receiver_id]; exists {
				if err := conn.WriteJSON(wsMsg); err != nil {
					log.Println("Error sending message:", err)
					return
				}
			}
			mu.Unlock()
		} else {
			log.Println("Error enregistring message:", err)
			return
		}
	}
}

func storeMessage(senderID, receiverID int, msg string) bool {
	query := "INSERT INTO messages VALUES(NULL, ?, ?, ?, 0,?)"
	_, err := DB.Exec(query, senderID, receiverID, msg, time.Now().Unix())
	return err == nil
}
