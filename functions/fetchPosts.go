package functions

import (
	"database/sql"
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
	query := "SELECT p.post_id, p.title, p.body, p.created_at, (SELECT GROUP_CONCAT(c.category_name, ', ') FROM posts_categories pc JOIN categories c ON pc.category_id = c.category_id WHERE pc.post_id = p.post_id) AS categories, u.username, u.image, COUNT(DISTINCT CASE WHEN l.like = 1 THEN l.user_id END) AS liked,COUNT(DISTINCT CASE WHEN l.like = 0 THEN l.user_id END) AS disliked,MAX(CASE WHEN l.user_id = ? THEN l.like END) AS user_reaction, COUNT(DISTINCT cm.comment_id) AS totalComments FROM `posts` p INNER JOIN users u ON u.user_id = p.user_id LEFT JOIN `likes` l ON p.post_id = l.post_id LEFT JOIN `comments` cm ON cm.post_id = p.post_id GROUP BY p.post_id, p.title, p.body, p.created_at, u.username, u.image ORDER BY p.created_at DESC LIMIT ? OFFSET ?"
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
		var reaction sql.NullString
		err := rows.Scan(&post.Post_id, &post.Title, &post.Body, &post.Created_at, &post.Categories, &post.Username, &post.Image, &post.Liked, &post.Disliked, &reaction, &post.TotalComments)
		if err != nil {
			fmt.Printf("Scan error: %v\n", err) // Add error logging
		}
		if reaction.Valid {
			post.User_reaction = reaction.String
		} else {
			post.User_reaction = ""
		}
		posts = append(posts, post)
	}
	fmt.Println(posts)
	jsonData, err := json.Marshal(posts)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
	// json.NewEncoder(w).Encode(posts)
} 