package server

import (
	"fmt"
	"net/http"
	"os"
	"real-time-forum/database"
)

type WebServer struct {
	Mux *http.ServeMux
	DB  database.DBTX
}

func AddHandlers(mux *http.ServeMux) {
	AddFileServer(mux)
	mux.HandleFunc("/api/login", LoginHandler)

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
