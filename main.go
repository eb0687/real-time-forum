package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/server"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", models.DB_NAME)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}
	WebServer := server.WebServer{
		Mux: http.NewServeMux(),
		DB:  database.New(db),
	}
	defer db.Close()

	WebServer.AddHandlers()
	// Start server
	fmt.Println("Listening on", models.DEFAULT_PORT)
	err = http.ListenAndServe(models.DEFAULT_PORT, WebServer.Mux)
	if err != nil {
		fmt.Println(err)
	}
}
