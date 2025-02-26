package functions

import (
	"database/sql"
	"time"
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

// type AllUsers struct {
// 	User User
// }
type PageErrors struct {
	Code    int
	Message string
}

var (
	DB   *sql.DB
	user User
	allUser []User
)

const tokenAge = 24 * time.Hour
