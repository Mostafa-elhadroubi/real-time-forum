package functions

import (
	"database/sql"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type User struct {
	Id         int
	Username   string
	Email      string
	Password   string
	Token      any
	Token_Exp  int
	Image      string
	Log        int
	ErrorEmail string
}

type Messages struct {
	Message_id  int
	Sender_id   int
	Receiver_id int
	Message     string
	Sent_at     int
}

type Receiver struct {
	ReceiverId int `json:"receiverId"`
	MsgNbr     int `json:"msgNbr"`
}
type PageErrors struct {
	Code    int
	Message string
}

var (
	DB       *sql.DB
	user     User
	msg      Messages
	allUser  []User
	allMsg   []Messages
	receiver Receiver
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	clients = make(map[int]*websocket.Conn)
	mu      sync.Mutex
)

const tokenAge = 24 * time.Hour
