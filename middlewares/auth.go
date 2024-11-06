package middlewares

import (
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
)

func Auth(next http.Handler, db *database.Queries) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			panic(models.ErrUnauthorized)
		}

		token := cookie.Value

		_, err = db.ReadCookieByUUID(token)
		if err != nil {
			panic(models.ErrUnauthorized)
		}

		next.ServeHTTP(w, r)
	})
}
