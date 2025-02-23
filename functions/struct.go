package functions

import "database/sql"

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
	DB *sql.DB
	user User
	// error PageErrors
)
