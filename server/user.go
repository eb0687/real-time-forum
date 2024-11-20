package server

import (
	"net/http"
	"real-time-forum/models"
	"real-time-forum/utils"
	"strconv"
)

func (ws *WebServer) GetUserDetailsById(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	userData, err := ws.DB.ReadUser(id)
	if err != nil {
		panic(models.ErrUserNotFound)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, userData)
	if err != nil {
		panic(err)
	}
}
