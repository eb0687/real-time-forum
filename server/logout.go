package server

import (
	"net/http"
	"real-time-forum/models"
	"real-time-forum/utils"
)

func (ws *WebServer) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	c := utils.GetAuthCookie(r)
	if c == nil {
		panic(models.ErrUnauthorized)
	}


	ws.DB.DeleteCookieByUUID(c.Value)
	c = &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: false,
	}

	http.SetCookie(w, c)

	err := utils.SendJsonResponse(w, http.StatusOK, models.MessageResponse{
		Msg: "Logout successful",
	})
	if err != nil {
		panic(models.ErrInternalServerError)
	}
}
