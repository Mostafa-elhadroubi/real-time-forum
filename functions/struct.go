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

type PageErrors struct {
	Code    int
	Message string
}

var (
	DB      *sql.DB
	user    User
	allUser []User

	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},	
	}

	clients = make(map[int]*websocket.Conn)
	mu sync.Mutex
)

const tokenAge = 24 * time.Hour
