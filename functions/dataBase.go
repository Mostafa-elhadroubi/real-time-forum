package functions

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func CreateDatabase() {
	db, err := sql.Open("sqlite3", "db/forum.db")
	if err != nil {
		db.Close()
		log.Fatal("Error: ", err)
	}
	DB = db
	creation, err := os.ReadFile("db/forum.sql")
	if err != nil {
		log.Fatal("Error: ", err)
	}
	_, err = db.Exec(string(creation))
	if err != nil {
		log.Fatal("Error: ", err)
	}
	CreateCategories()
}

func CreateCategories() {
	categories := []string{"Arts", "Events", "Buisness", "Articles", "Others"}
	query := "INSERT INTO categories VALUES(?, ?)"
	for id, category := range categories {
		_, err := DB.Exec(query, id+1, category)
		if err != nil {
			break
		}

	}
}
