package functions

import (
	"database/sql"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type User struct {
	Id              int
	Username        string
	Email           string
	Password        string
	Token           any
	Token_Exp       int
	Image           string
	Log             int
	ConnectedUserId int
	ErrorEmail      string
}

type Messages struct {
	Message_id  int
	Sender_id   int
	Receiver_id int
	Message     string
	IsRead      bool
	Sent_at     int
}

type Receiver struct {
	ReceiverId int `json:"receiverId"`
	MsgNbr     int `json:"msgNbr"`
}

type PostNum struct {
	PostNum int `json:"postNum"`
}
type ResponseComment struct {
	CommentNum int `json:"commentNum"`
	Post_id    int `json:"post_id"`
}

type WsMessages struct {
	Sender_id   int    `json:"senderId"`
	Receiver_id int    `json:"receiverId"`
	Text        string `json:"text"`
	Timestamp   string `json:"timestamp"`
}

type UserStatus struct {
	UserID   int  `json:"userId"`
	IsOnline bool `json:"isOnline"`
}

type Conversation struct {
	ConnectedUserId int
	Id              int
	Username        string
	Image           string
	IsConnected     bool
	LastMessage     sql.NullString
	Time            sql.NullString
	UnreadMessages  int
}
type PageErrors struct {
	Code    int
	Message string
}
type Category struct {
	Id   int
	Name string
}
type Posts struct {
	Post_id       int            `json:"post_id"`
	Title         string         `json:"title"`
	Body          string         `json:"body"`
	Created_at    string         `json:"created_at"`
	Categories    string         `json:"categories"`
	Username      string         `json:"username"`
	Image         string         `json:"image"`
	Liked         int            `json:"liked"`
	Disliked      int            `json:"disliked"`
	User_reaction string `json:"user_reaction"`
	TotalComments int            `json:"totalComments"`
}
type CommentData struct {
	Comment_id      int    `json:"comment_id"`
	Username        string `json:"username"`
	Image           string `json:"image"`
	Body            string `json:"body"`
	Created_at      string `json:"created_at"`
	LikedComment    int    `json:"likedComment"`
	DislikedComment int    `json:"dislikedComment"`
}
type ResponseLike struct {
	Post_id    int `json:"post_id"`
	LikeValue  int `json:"like"`
	Comment_id int `json:"comment_id"`
	CommentBody string `json:"contentBody"`
}

var (
	DB      *sql.DB
	user    User
	msg     Messages
	allUser []User
	// allMsg    []Messages
	receiver Receiver

	// userState UserStatus
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	clients = make(map[int]*websocket.Conn)
	mu      sync.Mutex
)

const tokenAge = 24 * time.Hour
