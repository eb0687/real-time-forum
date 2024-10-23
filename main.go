package main

import (
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	defer database.CloseDB()
	err := database.Init()
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}

	fs := http.FileServer(http.Dir("./public/"))
	http.Handle("/", fs)

	fmt.Println("Listening on :8000")
	err = http.ListenAndServe(models.DEFAULT_PORT, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
}
