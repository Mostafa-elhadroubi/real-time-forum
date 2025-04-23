package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func Comments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		Error(w,http.StatusMethodNotAllowed)
		return
	}
	_, err := GetUserFromSession(w, r)
	if err != nil {
		fmt.Println("Error in getting user id")
		Error(w,http.StatusInternalServerError)
		return
	}

	comment := ResponseComment{}
	err = json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		Error(w,http.StatusInternalServerError)
		return
	}
	fmt.Println(comment)
	query := "select c.comment_id, c.body, c.created_at, u.username, u.image, count(distinct case when l.like = 1 then l.user_id end) as likedComment, count(distinct case when l.like = 0 then l.user_id end) as dislikedComment from `comments` c inner join `users` u on c.user_id = u.user_id left join `likes` l on l.comment_id = c.comment_id where c.post_id = ? group by c.comment_id ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
	rows, err := DB.Query(query, comment.Post_id, 4, comment.CommentNum)
	if err != nil {
		Error(w,http.StatusInternalServerError)
		return
	}
	dataComment := []CommentData{}
	for rows.Next() {
		comment := CommentData{}
		rows.Scan(&comment.Comment_id, &comment.Body, &comment.Created_at, &comment.Username, &comment.Image, &comment.LikedComment, &comment.DislikedComment)
		dataComment = append(dataComment, comment)
	}
	json.NewEncoder(w).Encode(dataComment)
	w.Header().Set("Content-Type","application/json")
	fmt.Println(dataComment)
}
