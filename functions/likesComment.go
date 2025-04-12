package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func LikesComments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	fmt.Println("this like")
	resLike := ResponseLike{}
	err := json.NewDecoder(r.Body).Decode(&resLike)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	fmt.Println(resLike)

	if resLike.LikeValue != 0 && resLike.LikeValue != 1 {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	user_id, err := GetUserFromSession(w, r)
	fmt.Println(user_id, "likes")
	query := "SELECT like FROM likes WHERE user_id = ? AND comment_id = ? AND post_id ISNULL"
	row := DB.QueryRow(query, user_id, resLike.Comment_id)
	liked := false
	err = row.Scan(&liked)
	if err != nil {
		query = "INSERT INTO likes(like,user_id,comment_id) VALUES (?,?,?)"
		DB.Exec(query, resLike.LikeValue, user_id, resLike.Comment_id)

	} else {
		if (resLike.LikeValue == 1 && liked) || (resLike.LikeValue == 0 && !liked) {
			query = "DELETE FROM likes WHERE user_id = ? AND comment_id = ? AND post_id ISNULL"
			DB.Exec(query, user_id, resLike.Comment_id)
		} else {
			query = "UPDATE likes SET like = ? WHERE user_id = ? AND comment_id = ? AND post_id ISNULL"
			DB.Exec(query, resLike.LikeValue, user_id, resLike.Comment_id)
		}
	}

	// http.Redirect(res, req, strings.Split(req.Referer(), ":8080")[1]+"#comment"+comment_id, http.StatusFound)
}

