package server

import (
	"net/http"
	"real-time-forum/models"
	"real-time-forum/utils"
)

func (ws *WebServer) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("auth_token")
	if err != nil {
		if err == http.ErrNoCookie {
			return
		}
		panic(models.ErrInternalServerError)
	}

	// TODO: implement remove cookie from the cookies table in the db

	ws.DB.DeleteCookieByUUID(c.Value)
	c = &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: false,
	}

	http.SetCookie(w, c)

	err = utils.SendJsonResponse(w, http.StatusOK, models.MessageResponse{
		Msg: "Logout successful",
	})
	if err != nil {
		panic(models.ErrInternalServerError)
	}
}
