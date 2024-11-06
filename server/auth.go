package server

import (
	"net/http"
	"real-time-forum/utils"
)

func (ws *WebServer) CheckCookie(w http.ResponseWriter, r *http.Request) {
	utils.SendJsonResponse(w, http.StatusOK, map[string]string{
		"message": "Cookie is valid",
	})
}
