package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func AddComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		ErrorPage(w, r, http.StatusMethodNotAllowed, http.StatusText(http.StatusMethodNotAllowed))
		return
	}
	fmt.Println("comment")
	comment := ResponseLike{}
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		fmt.Println("JSON decode error:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if comment.CommentBody == "" || len(comment.CommentBody) > 400 || comment.Post_id < 1 {
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}
	user_id, err := GetUserFromSession(w, r)
	fmt.Println(user_id)
	if err != nil {
		fmt.Println("Error in getting user id")
		http.Error(w, "Error in getting user id", http.StatusInternalServerError)
		return
	}
	fmt.Printf("xx %#v", comment)
	query := "INSERT INTO comments VALUES (NULL, ?, ?, ?, ?)"
	_, err = DB.Exec(query, user_id, comment.Post_id, comment.CommentBody, time.Now().Unix())
	if err != nil {
		http.Error(w, "error in inserting in the DB!", http.StatusInternalServerError)
		return
	}
	fmt.Println("inserted  comment!!!")
}
