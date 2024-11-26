package server

import (
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
)

// client params
type LoginClientParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (ws *WebServer) LoginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("mama")
	data, err := utils.DecodeRequestBody[LoginClientParams](r)
	if err != nil {
		utils.SendCustomError(w, models.ErrInvalidRequest)
		return
	}

	u, err := ws.DB.GetUserByEmailOrName(database.GetUserByEmailOrNameParams{
		Nickname: data.Email,
		Email:    data.Email,
	})
	if err != nil {
		utils.SendCustomError(w, models.ErrUserNotFound)
		return
	}

	isPasswordCorrect := utils.CheckPasswordHashFunc(data.Password, u.Password)
	if !isPasswordCorrect {
		utils.SendCustomError(w, models.ErrUsernameOrPasswordIncorrect)
		return
	}

	err = utils.GenerateCookie(w, u.ID, ws.DB)
	if err != nil {
		utils.SendCustomError(w, models.ErrInternalServerError)
		return
	}

	err = utils.SendJsonResponse(w, http.StatusOK, models.MessageResponse{
		Msg: "Login success",
	})
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}
}
