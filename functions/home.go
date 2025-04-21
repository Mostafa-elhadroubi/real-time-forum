package functions

import (
	"net/http"
	"text/template"
	"time"

	"github.com/gofrs/uuid"
)

func verifyToken(token string) bool {
	if _, err := uuid.FromString(token); err != nil {
		return false
	}

	query := `SELECT user_id, username, email, password, image, token, token_exp, isConnected FROM users WHERE token = ?`
	row := DB.QueryRow(query, token)
	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.Password, &user.Image, &user.Token, &user.Token_Exp, &user.Log)
	isValidateTime := int(time.Now().Unix()) < user.Token_Exp
	return err == nil && isValidateTime

}
func Home(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		Error(w, http.StatusMethodNotAllowed)
		return
	}
	tmp, err := template.ParseFiles("./html/main.html")
	if err != nil {
		Error(w, http.StatusNotFound)
	}
	tmp.Execute(w, nil)
}
