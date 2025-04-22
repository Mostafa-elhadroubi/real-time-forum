package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func AddComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		Error(w, http.StatusMethodNotAllowed)
		return
	}
	fmt.Println("comment")
	comment := ResponseLike{}
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		fmt.Println("JSON decode error:", err)
		Error(w,http.StatusBadRequest)
		// http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if comment.CommentBody == "" || len(comment.CommentBody) > 400 || comment.Post_id < 1 {
		Error(w,http.StatusBadRequest)
		return
	}
	user_id, err := GetUserFromSession(w, r)
	fmt.Println(user_id)
	if err != nil {
		fmt.Println("Error in getting user id")
		Error(w,http.StatusBadRequest)
		return
	}
	fmt.Printf("xx %#v", comment)
	query := "INSERT INTO comments VALUES (NULL, ?, ?, ?, ?)"
	_, err = DB.Exec(query, user_id, comment.Post_id, comment.CommentBody, time.Now().Unix())
	if err != nil {
		Error(w,http.StatusInternalServerError)
		return
	}
	fmt.Println("inserted  comment!!!")
}

func Error(w http.ResponseWriter, code int) {
	error := PageErrors{
		Code: code,
		Message: http.StatusText(code),
	}
	w.WriteHeader(code)
	jsonData, _ := json.Marshal(&error)
	w.Write(jsonData)
}
