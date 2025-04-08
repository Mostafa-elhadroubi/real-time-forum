package functions

import (
	"fmt"
	"log"
	"net/http"
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
	
	for _, v := range categoriesForm{
		exists := false
		for _, v2 := range FetchCategories(){
			if v == v2.Name{
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

	
	// Printing the received data
	fmt.Printf("Title: %s\n", title)
	fmt.Printf("Body: %s\n", body)
	fmt.Printf("Categories: %v\n", categoriesForm)

	// Respond with a JSON object (for success)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Post successfully received"}`))
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
