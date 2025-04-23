package functions

import (
	"encoding/json"
	"net/http"
	"time"
)

func AddComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		Error(w, http.StatusMethodNotAllowed)
		return
	}
	comment := ResponseLike{}
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		Error(w, http.StatusBadRequest)
		return
	}

	if comment.CommentBody == "" || len(comment.CommentBody) > 400 || comment.Post_id < 1 {
		Error(w, http.StatusBadRequest)
		return
	}
	user_id, err := GetUserFromSession(w, r)
	if err != nil {
		Error(w, http.StatusBadRequest)
		return
	}
	query := "INSERT INTO comments VALUES (NULL, ?, ?, ?, ?)"
	_, err = DB.Exec(query, user_id, comment.Post_id, comment.CommentBody, time.Now().Unix())
	if err != nil {
		Error(w, http.StatusInternalServerError)
		return
	}

}

func Error(w http.ResponseWriter, code int) {
	error := PageErrors{
		Code:    code,
		Message: http.StatusText(code),
	}
	w.WriteHeader(code)
	jsonData, _ := json.Marshal(&error)
	w.Write(jsonData)
}
