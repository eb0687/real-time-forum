package database

import (
	"database/sql"
)

type Category struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type Comment struct {
	ID        int64        `json:"id"`
	Userid    int64        `json:"userid"`
	Postid    int64        `json:"postid"`
	Body      string       `json:"body"`
	CreatedAt sql.NullTime `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
	Foreign   interface{}  `json:"foreign"`
}

type Cookie struct {
	ID        int64        `json:"id"`
	Userid    int64        `json:"userid"`
	Cookie    string       `json:"cookie"`
	CreatedAt sql.NullTime `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
}

type Message struct {
	ID         int64        `json:"id"`
	Senderid   int64        `json:"senderid"`
	Receiverid int64        `json:"receiverid"`
	Body       string       `json:"body"`
	CreatedAt  sql.NullTime `json:"created_at"`
	UpdatedAt  sql.NullTime `json:"updated_at"`
	Foreign    interface{}  `json:"foreign"`
}

type Post struct {
	ID        int64        `json:"id"`
	Userid    int64        `json:"userid"`
	Title     string       `json:"title"`
	Body      string       `json:"body"`
	CreatedAt sql.NullTime `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
}

type PostCategory struct {
	ID         int64 `json:"id"`
	PostID     int64 `json:"post_id"`
	CategoryID int64 `json:"category_id"`
}

type User struct {
	ID        int64        `json:"id"`
	Nickname  string       `json:"nickname"`
	Age       int64        `json:"age"`
	Gender    string       `json:"gender"`
	FirstName string       `json:"first_name"`
	LastName  string       `json:"last_name"`
	Email     string       `json:"email"`
	Password  string       `json:"password"`
	CreatedAt sql.NullTime `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
}
