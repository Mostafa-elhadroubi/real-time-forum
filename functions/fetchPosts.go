package functions

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func FetchPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Println("Method invalid")
		http.Error(w, "method invalid", http.StatusMethodNotAllowed)
		return
	}
	_, err := GetUserFromSession(w, r)
	if err != nil {
		fmt.Println("Error in getting user id")
		http.Error(w, "Error in getting user id", http.StatusInternalServerError)
		return
	}
	postNum := PostNum{}
	json.NewDecoder(r.Body).Decode(&postNum)
	query := "SELECT post_id, title, body, created_at FROM `posts` INNER JOIN `categories` ON posts.post_id = categories.post_id ORDER bY created_at DESC LIMIT ? OFFSET ?"
	rows,err := DB.Query(query, 10, postNum)
	if err != nil {
		http.Error(w, "error in inserting in the DB!", http.StatusInternalServerError)
		return
	}
	posts := []Posts{}
	for rows.Next() {
		post := Posts{}
		rows.Scan(&post.post_id, &post.title, &post.body, &post.created_at)
		posts = append(posts, post)
	}
	fmt.Println(posts)
} 