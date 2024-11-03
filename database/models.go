package database

import (
	"database/sql"
)

type Cookie struct {
	ID        int64        `json:"id"`
	Userid    int64        `json:"userid"`
	Cookie    string       `json:"cookie"`
	CreatedAt sql.NullTime `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
}

type Post struct {
	ID        int64        `json:"id"`
	Userid    int64        `json:"userid"`
	Title     string       `json:"title"`
	Body      string       `json:"body"`
	CreatedAt sql.NullTime `json:"created_at"`
	UpdatedAt sql.NullTime `json:"updated_at"`
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
