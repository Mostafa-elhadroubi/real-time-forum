package functions

import (
	"log"
	"net/http"
)

func CheckLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	cookie, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusInternalServerError) // 500 Internal Server Error
		return
	}

	token := cookie.Value

	if !isTokenValid(token) {
		// If the token is not valid
		w.WriteHeader(http.StatusUnauthorized) // 401 Unauthorized
		return
	}

	w.WriteHeader(http.StatusOK)

}

func isTokenValid(token string) bool {
	// Replace with your actual SQL query to validate the token
	query := `SELECT COUNT(1) FROM users WHERE token = ?`
	var count int
	err := DB.QueryRow(query, token).Scan(&count)
	if err != nil {
		log.Println("Error querying the database:", err)
		return false
	}

	// If the token exists and is active (count > 0), return true
	if count > 0 {
		return true
	}

	// Otherwise, the token is invalid or expired
	return false
}
