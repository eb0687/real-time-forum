package models

const (
	DB_NAME      = "./data.db"
	DEFAULT_PORT = ":8080"
)

type MessageResponse struct {
	Msg string `json:"msg"`
}
