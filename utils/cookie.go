package utils

import (
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
)

func GetCookie(r *http.Request, name string) *http.Cookie {
	c, err := r.Cookie(name)
	if err != nil {
		if err == http.ErrNoCookie {
			return nil
		}
		return nil
	}

	return c
}

func GetAuthCookie(r *http.Request) *http.Cookie {
	return GetCookie(r, "auth_token")
}

func GetCookieByUUID(r *http.Request, q *database.Queries) (*database.Cookie, error) {
	c := GetAuthCookie(r)
	if c == nil {
		return nil, models.ErrUnauthorized
	}
	data, err := q.ReadCookieByUUID(c.Value)
	if err != nil {
		return nil, models.ErrUnauthorized
	}

	return &data, nil
}
