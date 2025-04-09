package functions

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func AddPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Println("method invalid")
		http.Error(w, "Method Invalid", http.StatusMethodNotAllowed)
		return
	}
	fmt.Println("true")
	err := r.ParseMultipartForm(10)
	if err != nil {
		fmt.Println("ERROR IN PARS FORM")
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}
	title := r.FormValue("title")
	body := r.FormValue("body")
	categoriesForm := r.Form["categories"]
	
	for _, v1 := range categoriesForm{
		exists := false
		for _, v2 := range FetchCategories(){
			if v1 == v2.Name{
				exists = true
				break
			}
		}
		if !exists {
			fmt.Println("category does not exist!")
			http.Error(w, "category does not exist!", http.StatusBadRequest)
			return
		}
	}
	user_id, err  := GetUserFromSession(w, r)
	fmt.Println(user_id)
	if err != nil {
		fmt.Println("Error in getting user id")
		http.Error(w, "Error in getting user id", http.StatusInternalServerError)
		return
	}
	query:= "INSERT INTO posts VALUES (NULL, ?, ?, ?, ?)"
	res, err := DB.Exec(query, user_id, title, body, time.Now().Unix())
	if err != nil {
		http.Error(w, "error in inserting in the DB!", http.StatusInternalServerError)
		return
	}
	post_id, err:= res.LastInsertId()
	if err != nil {
		fmt.Println("error in the last index!!")
		http.Error(w, "error in the last index!!", http.StatusInternalServerError)
		return
	}
	for _, category := range categoriesForm {
		query := "INSERT INTO posts_categories VALUES (NULL, ?, ?)"
		_, err = DB.Exec(query, post_id, category)
		if err != nil {
			http.Error(w, "error in inserting in the DB!", http.StatusInternalServerError)
			return
		}
	}
	// Printing the received data
	fmt.Printf("Title: %s\n", title)
	fmt.Printf("Body: %s\n", body)
	fmt.Printf("Categories: %v\n", categoriesForm)
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
