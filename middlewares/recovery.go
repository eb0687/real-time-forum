package middlewares

import (
	"fmt"
	"net/http"
	"real-time-forum/models"
	"real-time-forum/utils"
)

func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			r := recover()
			if r == nil {
				return
			}
			fmt.Println("err",r)
			data, ok := r.(models.CustomError)
			if !ok {
				utils.SendCustomError(w, models.ErrInternalServerError)
				return
			}
			utils.SendCustomError(w, data)
		}()
		next.ServeHTTP(w, r)
	})
}
