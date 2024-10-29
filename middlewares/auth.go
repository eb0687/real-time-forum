package middlewares

import (
	"net/http"
)

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		println("auth 1")
		next.ServeHTTP(w, r)
		println("auth 2")
	})
}
