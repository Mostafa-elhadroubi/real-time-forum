package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func Likes(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		Error(w,http.StatusMethodNotAllowed)
		return
	}
	fmt.Println("this like")
	resLike := ResponseLike{}
	err := json.NewDecoder(r.Body).Decode(&resLike)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		Error(w,http.StatusBadRequest)
		return
	}
	fmt.Println(resLike)

	if resLike.LikeValue != 0 && resLike.LikeValue != 1 {
		Error(w,http.StatusBadRequest)
		return
	}
	user_id, err := GetUserFromSession(w, r)
	fmt.Println(user_id, "likes")
	query := "SELECT like FROM likes WHERE user_id = ? AND comment_id ISNULL AND post_id = ?"
	row := DB.QueryRow(query, user_id, resLike.Post_id)
	liked := false
	err = row.Scan(&liked)
	if err != nil {
		query = "INSERT INTO likes(user_id, post_id, like) VALUES (?,?,?)"
		DB.Exec(query,  user_id, resLike.Post_id, resLike.LikeValue)

	} else {
		if (resLike.LikeValue == 1 && liked) || (resLike.LikeValue == 0 && !liked) {
			query = "DELETE FROM likes WHERE user_id = ? AND comment_id ISNULL AND post_id = ?"
			DB.Exec(query, user_id, resLike.Post_id)
		} else {
			query = "UPDATE likes SET like = ? WHERE user_id = ? AND comment_id ISNULL AND post_id = ?"
			DB.Exec(query, resLike.LikeValue, user_id, resLike.Post_id)
		}
	}
}
