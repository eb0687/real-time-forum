package models

import "net/http"

type CustomError struct {
	Msg    string `json:"msg"`
	Status int    `json:"status"`
}

var (
	ErrUserNotFound = CustomError{
		Msg:    "user not found",
		Status: http.StatusNotFound,
	}
	ErrUsernameOrPasswordIncorrect = CustomError{
		Msg:    "username or password is incorrect",
		Status: http.StatusUnauthorized,
	}
)
