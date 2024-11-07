package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/server"

	_ "github.com/mattn/go-sqlite3"
)

func initDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", models.DB_NAME)
	if err != nil {
		return nil, err
	}
	// apply schema

	data, err := os.ReadFile(`database/sql/schema.sql`)
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(string(data))
	if err != nil {
		return nil, err
	}

	return db, nil
}

func main() {
	db, err := initDB()
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}
	WebServer := server.WebServer{
		DB: database.New(db),
	}
	defer db.Close()

	WebServer.AddHandlers()
	fmt.Println("Listening on", models.DEFAULT_PORT)
	err = http.ListenAndServe(models.DEFAULT_PORT, WebServer.Mux)
	if err != nil {
		fmt.Println(err)
	}
}
