package server

import (
	"fmt"
	"net/http"
	"real-time-forum/utils"
	"time"
)

type LoginClientParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginServerResponse struct {
	Msg string `json:"msg"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[LoginClientParams](r)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}

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
