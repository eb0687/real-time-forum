package server

import (
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
	"strings"
)

func (ws *WebServer) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[database.CreateUserParams](r)
	if err != nil {
		fmt.Printf("err1: %v\n", err)
		utils.SendCustomError(w, models.ErrInvalidRequest)
		return
	}

	if strings.TrimSpace(data.Nickname) == "" ||
		strings.TrimSpace(data.Password) == "" ||
		strings.TrimSpace(data.Email) == "" ||
		strings.TrimSpace(data.FirstName) == "" ||
		strings.TrimSpace(data.LastName) == "" {
		utils.SendCustomError(w, models.ErrInvalidRequest)
	}

	passhash, err := utils.HashingPasswordFunc(data.Password)
	if err != nil {
		utils.SendCustomError(w, models.ErrInternalServerError)
		return
	}

	data.Password = passhash
	user, err := ws.DB.CreateUser(*data)
	if err != nil {
		utils.SendCustomError(w, models.ErrInternalServerError)
	}

	utils.SendJsonResponse(w, http.StatusOK, user)
}
