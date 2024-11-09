package server

import (
	"net/http"
	"real-time-forum/models"
	"real-time-forum/utils"
	"strconv"
)

func (ws *WebServer) GetOwnUserProfile(w http.ResponseWriter, r *http.Request) {
	cookie, err := utils.GetCookieByUUID(r, ws.DB)
	if err != nil {
		panic(models.ErrUnauthorized)
	}

	userData, err := ws.DB.ReadUser(cookie.Userid)
	if err != nil {
		panic(models.ErrUserNotFound)
	}
	userData.Password = ""
	if err := utils.SendJsonResponse(w, http.StatusOK, userData); err != nil {
		panic(err)
	}
}

func (ws *WebServer) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	// data, err := utils.DecodeRequestBody[database.User](r)
	// if err != nil {
	// 	panic(err)
	// }

	// data.ID = id

	userData, err := ws.DB.ReadUser(id)
	if err != nil {
		panic(err)
	}

	// TODO: need to handle user status (online/offline) and pass it to the client

	err = utils.SendJsonResponse(w, http.StatusOK, userData)
	if err != nil {
		panic(err)
	}
}
