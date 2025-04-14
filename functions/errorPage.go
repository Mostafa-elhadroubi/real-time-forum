package functions

import (
	"fmt"
	"net/http"
)

func ErrorPage(w http.ResponseWriter, r *http.Request, code int, message string) {
	w.WriteHeader(code) // Set the actual HTTP status code

	// Write a simple HTML response (or use a template if you prefer)
	fmt.Fprintf(w, `
		<!DOCTYPE html>
		<html>
		<head><title>Error %d</title></head>
		<body>
			<h1>Error %d</h1>
			<p>%s</p>
		</body>
		</html>
	`, code, code, message)
}
