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


	parent.HandleFunc("POST /api/posts", ws.CreatePost)
	parent.HandleFunc("GET /api/posts", ws.ReadAllPosts)
	parent.HandleFunc("GET /api/posts/{id}", ws.ReadPost)
	parent.HandleFunc("UPDATE /api/posts/{id}", ws.UpdatePost)
	parent.HandleFunc("DELETE /api/posts/{id}", ws.DeletePost)

	parent.Handle("/api/", http.StripPrefix("/api", RegisterWithAuth()))
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

func RegisterWithAuth() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/homepage", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Homepage")
	})
	return middlewares.Auth(router)
}
