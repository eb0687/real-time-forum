package models

import "errors"

var (
	ErrUserNotFound                = errors.New("user not found")
	ErrUsernameOrPasswordIncorrect = errors.New("username or password is incorrect")
)
