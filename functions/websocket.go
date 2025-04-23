package functions

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

func GetOnlineUsers(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()
	onlineUsers := []int{}
	for id, _ := range clients {
		onlineUsers = append(onlineUsers, id)
	}
	jsonData, err := json.Marshal(onlineUsers)
	if err != nil {
		Error(w, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}
func userStatus(userId int, isOnline bool) {
	mu.Lock()
	defer mu.Unlock()

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

}
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	userId, err := GetUserFromSession(w, r)
	if err != nil {
		Error(w, http.StatusNotFound)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}
	defer conn.Close()
	mu.Lock()
	clients[userId] = conn
	mu.Unlock()

	userStatus(userId, true)
	for {
		var wsMsg WsMessages
		if err := conn.ReadJSON(&wsMsg); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed:", err)
			} else {
				log.Println("Error reading message:", err)
			}
			mu.Lock()
			delete(clients, userId)
			mu.Unlock()
			userStatus(userId, false)
			break
		}

		if storeMessage(wsMsg.Sender_id, wsMsg.Receiver_id, wsMsg.Text) {
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
