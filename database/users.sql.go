
package database

import (
)

const createUser = `
INSERT INTO
    users (
        nickname,
        age,
        gender,
        first_name,
        last_name,
        email,
        password
    )
VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, nickname, age, gender, first_name, last_name, email, password, created_at, updated_at
`

type CreateUserParams struct {
	Nickname  string `json:"nickname"`
	Age       int64  `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func (q *Queries) CreateUser(arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(createUser,
		arg.Nickname,
		arg.Age,
		arg.Gender,
		arg.FirstName,
		arg.LastName,
		arg.Email,
		arg.Password,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Nickname,
		&i.Age,
		&i.Gender,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteUser = `
DELETE FROM users WHERE id = ?
`

func (q *Queries) DeleteUser(id int64) error {
	_, err := q.db.Exec(deleteUser, id)
	return err
}

const getUserByEmailOrName = `
SELECT id, nickname, age, gender, first_name, last_name, email, password, created_at, updated_at FROM users WHERE ( nickname = ? OR email = ? )
`

type GetUserByEmailOrNameParams struct {
	Nickname string `json:"nickname"`
	Email    string `json:"email"`
}

func (q *Queries) GetUserByEmailOrName(arg GetUserByEmailOrNameParams) (User, error) {
	row := q.db.QueryRow(getUserByEmailOrName, arg.Nickname, arg.Email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Nickname,
		&i.Age,
		&i.Gender,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const readAllUsers = `
SELECT id, nickname, age, gender, first_name, last_name, email, password, created_at, updated_at FROM users
`

func (q *Queries) ReadAllUsers() ([]User, error) {
	rows, err := q.db.Query(readAllUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Nickname,
			&i.Age,
			&i.Gender,
			&i.FirstName,
			&i.LastName,
			&i.Email,
			&i.Password,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const readUser = `
SELECT
id, nickname, age, gender, first_name, last_name, email, password, created_at, updated_at
FROM users
WHERE
    id = ?
`

func (q *Queries) ReadUser(id int64) (User, error) {
	row := q.db.QueryRow(readUser, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Nickname,
		&i.Age,
		&i.Gender,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateUser = `
UPDATE users
SET
    nickname = ?,
    age = ?,
    gender = ?,
    first_name = ?,
    last_name = ?,
    email = ?,
    password = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE
    id = ?
`

type UpdateUserParams struct {
	Nickname  string `json:"nickname"`
	Age       int64  `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	ID        int64  `json:"id"`
}

func (q *Queries) UpdateUser(arg UpdateUserParams) error {
	_, err := q.db.Exec(updateUser,
		arg.Nickname,
		arg.Age,
		arg.Gender,
		arg.FirstName,
		arg.LastName,
		arg.Email,
		arg.Password,
		arg.ID,
	)
	return err
}
