package middlewares

import "net/http"

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		println("log 1")
		next.ServeHTTP(w, r)
		println("log 2")
	})
}
