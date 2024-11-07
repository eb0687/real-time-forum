package server

import (
	"fmt"
	"net/http"
	"os"
	"real-time-forum/database"
	"real-time-forum/middlewares"
)

type WebServer struct {
	Mux http.Handler
	DB  *database.Queries
}

func (ws *WebServer) AddHandlers() {
	parent := http.NewServeMux()
	AddFileServer(parent)
	s := middlewares.CreateStack(
		middlewares.Logging,
		middlewares.Recovery,
	)

	parent.HandleFunc("/api/login", ws.LoginHandler)
	parent.HandleFunc("/api/register", ws.RegisterHandler)
	parent.HandleFunc("/api/logout", ws.LogoutHandler)



	parent.Handle("/api/", http.StripPrefix("/api", ws.RegisterWithAuth()))
	ws.Mux = s(parent)
}

func AddFileServer(mux *http.ServeMux) {
	fs := http.FileServer(http.Dir("./public"))
	mux.Handle("/public/", http.StripPrefix("/public/", fs))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("r.Cookies(): %v\n", r.Cookies())
		_, err := os.Stat(r.URL.Path)
		if err != nil && os.IsNotExist(err) {
			// w.WriteHeader(http.StatusNotFound)
			http.ServeFile(w, r, "public/index.html")
			return
		}
		http.ServeFile(w, r, "public"+r.URL.Path)
	})
}

func (ws *WebServer) RegisterWithAuth() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/homepage", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Homepage")
	})



	router.HandleFunc("POST /api/comments", ws.CreateComment)
	router.HandleFunc("GET /api/comments", ws.ReadAllComments)
	router.HandleFunc("PATCH /api/comments/{id}", ws.UpdatePost)
	router.HandleFunc("DELETE /api/comments/{id}", ws.DeletePost)

	router.HandleFunc("POST /posts", ws.CreatePost)
	router.HandleFunc("GET /posts", ws.ReadAllPosts)
	router.HandleFunc("GET /posts/{id}", ws.ReadPost)
	router.HandleFunc("PUT /posts/{id}", ws.UpdatePost)
	router.HandleFunc("DELETE /posts/{id}", ws.DeletePost)

	router.HandleFunc("/cookie", ws.CheckCookie)
	return middlewares.Auth(router, ws.DB)
}
