package functions

import (
	"net/http"
	"text/template"
)

func Home(w http.ResponseWriter, r *http.Request) {
	tmp, err := template.ParseFiles("../html/main.html")
	if err != nil {
		http.Error(w, "Can not parse the main file", http.StatusNotFound)
	}
	tmp.Execute(w, nil)
}
