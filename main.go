package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("./public"))
	mux.Handle("/public/", http.StripPrefix("/public/", fs))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		_, err := os.Stat(r.URL.Path)
		if err != nil && os.IsNotExist(err) {
			http.ServeFile(w, r, "public/index.html")
			return
		}
		http.ServeFile(w, r, "public"+r.URL.Path)
	})

	// Start server
	fmt.Println("Listening on :8000")
	err := http.ListenAndServe(":8000", mux)
	if err != nil {
		fmt.Println(err)
	}
}
