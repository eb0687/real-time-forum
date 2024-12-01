package server

import (
	"fmt"
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

	// testing the output
	fmt.Printf("categories: %v\n", categories)

	err = utils.SendJsonResponse(w, http.StatusOK, categories)
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) CreatePostCategory(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[database.CreatePostCategoryParams](r)
	fmt.Println("1")
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	pc, err := ws.DB.CreatePostCategory(*data)
	fmt.Println("1")
	if err != nil {
		panic(err)
	}

	err = utils.SendJsonResponse(w, http.StatusCreated, pc)
	fmt.Println("1")
	if err != nil {
		panic(err)
	}
}

func (ws *WebServer) GetPostCategories(w http.ResponseWriter, r *http.Request) {
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

	err = utils.SendJsonResponse(w, http.StatusOK, nil)
	if err != nil {
		panic(err)
	}
}
