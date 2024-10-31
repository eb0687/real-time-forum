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
		panic(models.ErrInvalidRequest)
	}

	if strings.TrimSpace(data.Nickname) == "" ||
		strings.TrimSpace(data.Password) == "" ||
		strings.TrimSpace(data.Email) == "" ||
		strings.TrimSpace(data.FirstName) == "" ||
		strings.TrimSpace(data.LastName) == "" {
		fmt.Println("err invalid request")
		panic(models.ErrInvalidRequest)
	}

	if _, err := ws.DB.GetUserByEmailOrName(database.GetUserByEmailOrNameParams{
		Nickname: data.Nickname,
		Email:    data.Email,
	}); err == nil {
		panic(models.ErrUserAlreadyExists)
	}

	passwordHash, err := utils.HashingPasswordFunc(data.Password)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data.Password = passwordHash
	user, err := ws.DB.CreateUser(*data)
	if err != nil {
		panic(models.ErrInternalServerError)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, user)
	if err != nil {
		panic(models.ErrInternalServerError)
	}

	err = utils.GenerateCookie(w, user.ID, ws.DB)
	if err != nil {
		panic(models.ErrInternalServerError)
	}
}
