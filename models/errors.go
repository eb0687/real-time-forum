package models

import "net/http"

type CustomError struct {
	Msg    string `json:"msg"`
	Status int    `json:"status"`
}


func (c CustomError) Error() string {
	return c.Msg
}

var (
	ErrUserNotFound = CustomError{
		Msg:    "user not found",
		Status: http.StatusNotFound,
	}
	ErrUserAlreadyExists = CustomError{
		Msg:    "user already exists please login",
		Status: http.StatusConflict,
	}
	ErrUsernameOrPasswordIncorrect = CustomError{
		Msg:    "username or password is incorrect",
		Status: http.StatusUnauthorized,
	}
	ErrInternalServerError = CustomError{
		Msg:    "Internal server error",
		Status: http.StatusInternalServerError,
	}

	ErrInvalidRequest = CustomError{
		Msg:    "Invalid request",
		Status: http.StatusBadRequest,
	}
	ErrUnauthorized = CustomError{
		Msg:    "Unauthorized",
		Status: http.StatusUnauthorized,
	}

)
