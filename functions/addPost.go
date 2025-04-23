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
		Error(w,http.StatusMethodNotAllowed)
		return
	}
	err := r.ParseMultipartForm(10)
	if err != nil {
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
