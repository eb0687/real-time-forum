package main

import (
	"fmt"
	"net/http"
	"real-time-forum/server"
)

func main() {
	mux := http.NewServeMux()

	server.AddHandlers(mux)
	// Start server
	fmt.Println("Listening on :8000")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		fmt.Println(err)
	}
}
