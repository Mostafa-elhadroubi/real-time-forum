package functions

import (
	"fmt"
	"net/http"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		Error(w,http.StatusMethodNotAllowed)
		return
	}
	fmt.Println(user.Id, "log out")
	user_id, err := GetUserFromSession(w,r)
	if err != nil {
		Error(w,http.StatusNotFound)
	}
	query := `UPDATE users SET token = ?, token_exp = ?, isConnected = ? WHERE user_id = ?`
	DB.Exec(query, "NULL", 0, 0, user_id)
	http.SetCookie(w, &http.Cookie{
		Name:   "token",
		Value:  "",
		Path:   "/login",
		MaxAge: -1,
	})
	// http.Redirect(w, r, "/login", http.StatusFound)

}
