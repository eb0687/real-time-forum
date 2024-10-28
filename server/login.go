package server

import (
	"context"
	"fmt"
	"net/http"
	"real-time-forum/database"
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

	s, err := utils.HashingPasswordFunc(data.Password)
	if err != nil {
		return
	}

	u, err := ws.DB.AuthUser(context.Background(), database.AuthUserParams{
		Nickname: data.Email,
		Email:    data.Email,
		Password: s,
	})
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}

	fmt.Printf("u: %v\n", u)
	return

	if data.Email != "a" && data.Password != "a" {
		err := utils.SendJsonResponse(w, http.StatusUnauthorized, LoginServerResponse{
			Msg: "Invalid email or password",
		})
		if err != nil {
			fmt.Printf("err: %v\n", err)
			return
		}
	}
	fmt.Println("1")
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

	fmt.Println("2")
}
