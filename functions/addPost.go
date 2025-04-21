package functions

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func AddPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Println("method invalid")
		Error(w,http.StatusMethodNotAllowed)
		return
	}
	fmt.Println("true")
	err := r.ParseMultipartForm(10)
	if err != nil {
		fmt.Println("ERROR IN PARS FORM")
		Error(w,http.StatusBadRequest)
		return
	}
	title := r.FormValue("title")
	body := r.FormValue("body")
	categories := r.Form["categories"]

	title, body = strings.TrimSpace(title), strings.TrimSpace(body)
	if title == "" || len(title) > 400 || body == "" || len(body) > 5000 {
		Error(w,http.StatusBadRequest)
		return
	}
	if len(categories) == 0 {
		categories = []string{"5"}
	} else {
		for _, categoryStr := range categories {
			categoryNum, err := strconv.Atoi(categoryStr)
			if err != nil {
				Error(w,http.StatusInternalServerError)
				return
			}
			if categoryNum < 1 || categoryNum > 5 {
				Error(w,http.StatusInternalServerError)
				return
			}

		}
	}

	user_id, err := GetUserFromSession(w, r)
	fmt.Println(user_id)
	if err != nil {
		fmt.Println("Error in getting user id")
		Error(w,http.StatusInternalServerError)
		return
	}
	query := "INSERT INTO posts VALUES (NULL, ?, ?, ?, ?)"
	res, err := DB.Exec(query, user_id, title, body, time.Now().Unix())
	if err != nil {
		Error(w,http.StatusInternalServerError)
		return
	}
	post_id, err := res.LastInsertId()
	if err != nil {
		fmt.Println("error in the last index!!")
		Error(w,http.StatusInternalServerError)
		return
	}
	for _, category := range categories {
		query := "INSERT INTO posts_categories VALUES (NULL, ?, ?)"
		_, err = DB.Exec(query, post_id, category)
		if err != nil {
			Error(w,http.StatusInternalServerError)
			return
		}
	}
	// Printing the received data
	fmt.Printf("Title: %s\n", title)
	fmt.Printf("Body: %s\n", body)
	fmt.Printf("Categories: %v\n", categories)
	http.Redirect(w, r, "/home", http.StatusFound)

	// Respond with a JSON object (for success)
	// w.Header().Set("Content-Type", "application/json")
	// w.WriteHeader(http.StatusOK)
	// w.Write([]byte(`{"message": "Post successfully received"}`))
}

func FetchCategories() []Category {
	query := "SELECT * FROM categories"
	rows, err := DB.Query(query)
	if err != nil {
		log.Fatal(err)

	}
	categories := []Category{}
	for rows.Next() {
		category := Category{}
		rows.Scan(&category.Id, &category.Name)
		categories = append(categories, category)
	}
	return categories
}
