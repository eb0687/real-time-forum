package main

import (
	"fmt"
	"net/http"
	"os"
	"real-time-forum/server"
)

func main() {
	mux := http.NewServeMux()
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
	server.AddHandlers(mux)
	// Start server
	fmt.Println("Listening on :8000")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		fmt.Println(err)
	}
}
