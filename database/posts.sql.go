
package database

import (
)

const createPost = `
INSERT INTO posts (userid, title, body) VALUES (?, ?, ?) RETURNING id, userid, title, body, created_at, updated_at
`

type CreatePostParams struct {
	Userid int64  `json:"userid"`
	Title  string `json:"title"`
	Body   string `json:"body"`
}

func (q *Queries) CreatePost(arg CreatePostParams) (Post, error) {
	row := q.db.QueryRow(createPost, arg.Userid, arg.Title, arg.Body)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Title,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deletePost = `
DELETE FROM posts WHERE id = ?
`

func (q *Queries) DeletePost(id int64) error {
	_, err := q.db.Exec(deletePost, id)
	return err
}

const getPostByID = `
SELECT id, userid, title, body, created_at, updated_at FROM posts WHERE id = ?
`

func (q *Queries) GetPostByID(id int64) (Post, error) {
	row := q.db.QueryRow(getPostByID, id)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Title,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const readAllPosts = `
SELECT id, userid, title, body, created_at, updated_at FROM posts ORDER BY created_at DESC
`

func (q *Queries) ReadAllPosts() ([]Post, error) {
	rows, err := q.db.Query(readAllPosts)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.Userid,
			&i.Title,
			&i.Body,
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

const readPostByID = `
SELECT id, userid, title, body, created_at, updated_at FROM posts WHERE id = ?
`

func (q *Queries) ReadPostByID(id int64) (Post, error) {
	row := q.db.QueryRow(readPostByID, id)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Title,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const readPostsByUserID = `
SELECT id, userid, title, body, created_at, updated_at FROM posts WHERE userid = ? ORDER BY created_at DESC
`

func (q *Queries) ReadPostsByUserID(userid int64) ([]Post, error) {
	rows, err := q.db.Query(readPostsByUserID, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.Userid,
			&i.Title,
			&i.Body,
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

const updatePost = `
UPDATE posts SET title = ?, body = ? WHERE id = ? RETURNING id, userid, title, body, created_at, updated_at
`

type UpdatePostParams struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	ID    int64  `json:"id"`
}

func (q *Queries) UpdatePost(arg UpdatePostParams) (Post, error) {
	row := q.db.QueryRow(updatePost, arg.Title, arg.Body, arg.ID)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Title,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
