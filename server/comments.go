package server

import (
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
	"strconv"
)

func (ws *WebServer) CreateComment(w http.ResponseWriter, r *http.Request) {
	c, err := utils.GetCookieByUUID(r, ws.DB)
	if err != nil {
		panic(err)
	}

	data, err := utils.DecodeRequestBody[database.CreateCommentParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data.Userid = c.Userid
	com, err := ws.DB.CreateComment(*data)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusCreated, com)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) ReadAllComments(w http.ResponseWriter, r *http.Request) {
	data, err := ws.DB.ReadAllComments()
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, data)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) ReadCommentsByPostId(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data, err := ws.DB.ReadCommentsbyPostID(id)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, data)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) UpdateComment(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data, err := utils.DecodeRequestBody[database.UpdateCommentParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data.ID = id
	newComment, err := ws.DB.UpdateComment(*data)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, newComment)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) DeleteComment(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	err = ws.DB.DeleteComment(id)
	if err != nil {
		panic(err)
	}
}
