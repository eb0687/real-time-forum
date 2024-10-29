package server

import (
	"context"
	"fmt"
	"net/http"
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

// func (ws *WebServer) LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	data, err := utils.DecodeRequestBody[LoginClientParams](r)
// 	if err != nil {
// 		fmt.Printf("err: %v\n", err)
// 		return
// 	}

// 	passhash, err := utils.HashingPasswordFunc(data.Password)
// 	if err != nil {
// 		fmt.Printf("err: %v\n", err)
// 		return
// 	}

// 	// _, err = ws.DB.CreateUser(context.Background(), database.CreateUserParams{
// 	// 	Nickname:  "test",
// 	// 	Age:       0,
// 	// 	Gender:    "",
// 	// 	FirstName: "",
// 	// 	LastName:  "",
// 	// 	Email:     "test@test.com",
// 	// 	Password:  passhash,
// 	// })
// 	// if err != nil {
// 	// 	fmt.Printf("err: %v\n", err)
// 	// }

// 	user, err := ws.DB.AuthUser(context.Background(), database.AuthUserParams{
// 		Nickname: data.Email,
// 		Email:    data.Email,
// 		Password: passhash,
// 	})
// 	if err != nil {
// 		fmt.Printf("auth err: %v\n", err)
// 		fmt.Printf("data.Password: %v\n", data.Password)
// 		// this is empty
// 		fmt.Printf("user.Password: %v\n", user.Password)
// 		return
// 	}

// 	isPasswordCorrect := utils.CheckPasswordHashFunc(data.Password, user.Password)
// 	if !isPasswordCorrect {
// 		fmt.Println("Incorrect password")
// 		return
// 	}

// 	fmt.Println("Password match confirmed")
// 	return

// 	if data.Email != "a" && data.Password != "a" {
// 		err := utils.SendJsonResponse(w, http.StatusUnauthorized, LoginServerResponse{
// 			Msg: "Invalid email or password",
// 		})
// 		if err != nil {
// 			fmt.Printf("err: %v\n", err)
// 			return
// 		}
// 	}

// 	// set cookie for storing token
// 	cookie := http.Cookie{
// 		Name:     "token",
// 		Value:    "123",
// 		Path:     "/",
// 		MaxAge:   int(time.Hour),
// 		HttpOnly: false,
// 		Secure:   false,
// 		SameSite: http.SameSiteLaxMode,
// 	}
// 	http.SetCookie(w, &cookie)

// 	err = utils.SendJsonResponse(w, http.StatusOK, LoginServerResponse{
// 		Msg: "Login success",
// 	})
// 	if err != nil {
// 		fmt.Printf("err: %v\n", err)
// 		return
// 	}
// }

func (ws *WebServer) LoginHandler(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[LoginClientParams](r)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}

	users, err := ws.DB.ReadAllUsers(context.Background())
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}

	var userFound bool
	for _, u := range users {
		if u.Email == data.Email {
			userFound = true
			isPasswordCorrect := utils.CheckPasswordHashFunc(data.Password, u.Password)
			if !isPasswordCorrect {
				fmt.Println("Incorrect password")
				return
			}
			break
		}
	}

	if !userFound {
		fmt.Println("User not found")
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
