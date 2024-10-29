package middlewares

import "net/http"

func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		println("recover 1")
		next.ServeHTTP(w, r)
		println("recover 2")
	})
}
