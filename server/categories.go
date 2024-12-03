package server

import (
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
	"strconv"
)

func (ws *WebServer) GetAllCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := ws.DB.ReadAllCategories()
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, categories)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) CreatePostCategory(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[database.CreatePostCategoryParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	pc, err := ws.DB.CreatePostCategory(*data)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusCreated, pc)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) GetAllCategoriesForPost(w http.ResponseWriter, r *http.Request) {
	postId, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	cat, err := ws.DB.ReadCategoriesForPost(postId)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, cat)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) DeletePostCategory(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[database.DeletePostCategoryParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	err = ws.DB.DeletePostCategory(*data)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, map[string]any{
		"data": "error from hell",
	})
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) GetAllPostsForCategory(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	data, err := ws.DB.ReadPostsForCategory(id)
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, data)
	if err != nil {
		panic(err)
	}
}
