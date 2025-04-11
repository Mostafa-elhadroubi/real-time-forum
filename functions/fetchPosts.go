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
	user_id, err := GetUserFromSession(w, r)
	if err != nil {
		fmt.Println("Error in getting user id")
		http.Error(w, "Error in getting user id", http.StatusInternalServerError)
		return
	}
	fmt.Println("yes it is")
	postNum := PostNum{}
	json.NewDecoder(r.Body).Decode(&postNum)
	query := "SELECT p.post_id, p.title, p.body, p.created_at, group_concat(c.category_name, ', ') AS categories, u.username, u.image, count(distinct case when l.like = 1 then l.user_id end) as liked , count(distinct case when l.like = 0 then l.user_id end) as disliked, MAX(CASE WHEN l.user_id = ? THEN l.like END) AS user_reaction FROM `posts` p INNER JOIN `posts_categories` pc ON p.post_id = pc.post_id INNER JOIN `categories` c ON c.category_id = pc.category_id INNER JOIN users u ON u.user_id = p.user_id LEFT JOIN `likes` l ON p.post_id = l.post_id GROUP BY p.post_id, p.title, p.body, p.created_at ORDER BY p.created_at DESC LIMIT ? OFFSET ?"
	rows,err := DB.Query(query, user_id, 10, postNum.PostNum)
	fmt.Println(postNum, "sdfsdfsd")
	// fmt.Println(rows)
	if err != nil {
		http.Error(w, "error in selecting in the DB!", http.StatusInternalServerError)
		return
	}
	fmt.Println("nesar")
	posts := []Posts{}
	for rows.Next() {
		post := Posts{}
		rows.Scan(&post.Post_id, &post.Title, &post.Body, &post.Created_at, &post.Categories, &post.Username, &post.Image, &post.Liked, &post.Disliked, &post.User_reaction)
		posts = append(posts, post)
	}
	fmt.Println(posts)
	jsonData, err := json.Marshal(posts)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
	// json.NewEncoder(w).Encode(posts)
} 