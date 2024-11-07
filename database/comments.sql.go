
package database

import (
)

const createComment = `
INSERT INTO comments (
 userid,
 postid,
 body
)
VALUES (?, ?, ? )
RETURNING id, userid, postid, body, created_at, updated_at, "foreign"
`

type CreateCommentParams struct {
	Userid int64  `json:"userid"`
	Postid int64  `json:"postid"`
	Body   string `json:"body"`
}

func (q *Queries) CreateComment(arg CreateCommentParams) (Comment, error) {
	row := q.db.QueryRow(createComment, arg.Userid, arg.Postid, arg.Body)
	var i Comment
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Postid,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Foreign,
	)
	return i, err
}

const deleteComment = `
DELETE FROM comments WHERE id = ?
`

func (q *Queries) DeleteComment(id int64) error {
	_, err := q.db.Exec(deleteComment, id)
	return err
}

const getCommentbyID = `
SELECT id, userid, postid, body, created_at, updated_at, "foreign" FROM comments WHERE id = ?
`

func (q *Queries) GetCommentbyID(id int64) (Comment, error) {
	row := q.db.QueryRow(getCommentbyID, id)
	var i Comment
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Postid,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Foreign,
	)
	return i, err
}

const readAllComments = `
SELECT id, userid, postid, body, created_at, updated_at, "foreign" FROM comments ORDER BY created_at DESC
`

func (q *Queries) ReadAllComments() ([]Comment, error) {
	rows, err := q.db.Query(readAllComments)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.ID,
			&i.Userid,
			&i.Postid,
			&i.Body,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Foreign,
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

const readCommentbyID = `
SELECT id, userid, postid, body, created_at, updated_at, "foreign" FROM comments WHERE id = ?
`

func (q *Queries) ReadCommentbyID(id int64) (Comment, error) {
	row := q.db.QueryRow(readCommentbyID, id)
	var i Comment
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Postid,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Foreign,
	)
	return i, err
}

const readCommentsbyPostID = `
SELECT id, userid, postid, body, created_at, updated_at, "foreign" FROM comments WHERE postid = ? ORDER BY created_at DESC
`

func (q *Queries) ReadCommentsbyPostID(postid int64) ([]Comment, error) {
	rows, err := q.db.Query(readCommentsbyPostID, postid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.ID,
			&i.Userid,
			&i.Postid,
			&i.Body,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Foreign,
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

const updateComment = `
UPDATE comments SET body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, userid, postid, body, created_at, updated_at, "foreign"
`

type UpdateCommentParams struct {
	Body string `json:"body"`
	ID   int64  `json:"id"`
}

func (q *Queries) UpdateComment(arg UpdateCommentParams) (Comment, error) {
	row := q.db.QueryRow(updateComment, arg.Body, arg.ID)
	var i Comment
	err := row.Scan(
		&i.ID,
		&i.Userid,
		&i.Postid,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Foreign,
	)
	return i, err
}
