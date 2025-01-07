package server

import (
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
	"strconv"
)

func (ws *WebServer) CreatePost(w http.ResponseWriter, r *http.Request) {
	c, err := utils.GetCookieByUUID(r, ws.DB)
	if err != nil {
		panic(err)
	}
	data, err := utils.DecodeRequestBody[database.CreatePostParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data.Userid = c.Userid
	if data.Body == "" {
		panic("Post body cannot be empty")
	}
	p, err := ws.DB.CreatePost(*data)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusCreated, p)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) ReadAllPosts(w http.ResponseWriter, r *http.Request) {
	data, err := ws.DB.ReadAllPosts()
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, data)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) ReadPost(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	p, err := ws.DB.ReadPostByID(id)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, p)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		panic(err)
	}
}

func (ws *WebServer) UpdatePost(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}
	data, err := utils.DecodeRequestBody[database.UpdatePostParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data.ID = id
	if data.Body == "" {
		panic("Post body cannot be empty")
	}

	newPost, err := ws.DB.UpdatePost(*data)
	if err != nil {
		panic(err)
	}
	err = utils.SendJsonResponse(w, http.StatusOK, newPost)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) DeletePost(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}
	err = ws.DB.DeletePost(id)
	if err != nil {
		panic(err)
	}
}
