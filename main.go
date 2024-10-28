package main

import (
	"fmt"
	"net/http"
	"real-time-forum/models"
	"real-time-forum/server"
)

func main() {
	WebServer := server.WebServer{
		Mux: http.NewServeMux(),
		DB:  nil,
	}

	server.AddHandlers(WebServer.Mux)
	// Start server
	fmt.Println("Listening on", models.DEFAULT_PORT)
	err := http.ListenAndServe(models.DEFAULT_PORT, WebServer.Mux)
	if err != nil {
		fmt.Println(err)
	}
}
