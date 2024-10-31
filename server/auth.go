package server

import "net/http"

func (ws *WebServer) CheckCookie(w http.ResponseWriter, r *http.Request) {
	// cookie, err := r.Cookie("session")
	// if err != nil {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }
}
