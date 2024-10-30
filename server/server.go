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
	s(parent)

	parent.HandleFunc("/api/login", ws.LoginHandler)
	parent.Handle("/api/", http.StripPrefix("/api", RegisterWithAuth()))
	ws.Mux = parent
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
