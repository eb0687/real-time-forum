package server

import (
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
	"time"
)

// client params
type LoginClientParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// server response
type LoginServerResponse struct {
	Msg string `json:"msg"`
}

func (ws *WebServer) LoginHandler(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[LoginClientParams](r)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}

	u, err := ws.DB.GetUserByEmailOrName(database.GetUserByEmailOrNameParams{
		Nickname: data.Email,
		Email:    data.Email,
	})

	if err != nil {
		fmt.Printf("err: %v\n", err)
		utils.SendJsonResponse(w, http.StatusNotFound, LoginServerResponse{models.ErrUserNotFound.Error()})
		return
	}

	isPasswordCorrect := utils.CheckPasswordHashFunc(data.Password, u.Password)
	if !isPasswordCorrect {
		fmt.Printf("err: %v\n", err)
		utils.SendJsonResponse(w, http.StatusUnauthorized, LoginServerResponse{models.ErrUsernameOrPasswordIncorrect.Error()})
		return
	}
	

	// set cookie for storing token
	cookie := http.Cookie{
		Name:     "token",
		Value:    "123",
		Path:     "/",
		MaxAge:   int(time.Hour),
		HttpOnly: false,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, &cookie)

	err = utils.SendJsonResponse(w, http.StatusOK, LoginServerResponse{
		Msg: "Login success",
	})
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}
}

