package functions

import "net/http"

func Static(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/js/" || r.URL.Path == "/css/" || r.URL.Path == "/images/" {
		w.WriteHeader(404)
		return
	}
	http.ServeFile(w, r, "."+r.URL.Path)
}
