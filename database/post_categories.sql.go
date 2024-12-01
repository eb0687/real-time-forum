
package database

import (
)

const createPostCategory = `
INSERT INTO post_categories (post_id, category_id)
VALUES (?, ?)
RETURNING id, post_id, category_id
`

type CreatePostCategoryParams struct {
	PostID     int64 `json:"post_id"`
	CategoryID int64 `json:"category_id"`
}

func (q *Queries) CreatePostCategory(arg CreatePostCategoryParams) (PostCategory, error) {
	row := q.db.QueryRow(createPostCategory, arg.PostID, arg.CategoryID)
	var i PostCategory
	err := row.Scan(&i.ID, &i.PostID, &i.CategoryID)
	return i, err
}

const deleteAllCategoriesForPost = `
DELETE FROM post_categories WHERE post_id = ?
`

func (q *Queries) DeleteAllCategoriesForPost(postID int64) error {
	_, err := q.db.Exec(deleteAllCategoriesForPost, postID)
	return err
}

const deletePostCategory = `
DELETE FROM post_categories
WHERE post_id = ? AND category_id = ?
`

type DeletePostCategoryParams struct {
	PostID     int64 `json:"post_id"`
	CategoryID int64 `json:"category_id"`
}

func (q *Queries) DeletePostCategory(arg DeletePostCategoryParams) error {
	_, err := q.db.Exec(deletePostCategory, arg.PostID, arg.CategoryID)
	return err
}

const readCategoriesForPost = `
SELECT pc.id, pc.post_id, pc.category_id, c.name
FROM post_categories pc
JOIN categories c ON pc.category_id = c.id
WHERE pc.post_id = ?
`

type ReadCategoriesForPostRow struct {
	ID         int64  `json:"id"`
	PostID     int64  `json:"post_id"`
	CategoryID int64  `json:"category_id"`
	Name       string `json:"name"`
}

func (q *Queries) ReadCategoriesForPost(postID int64) ([]ReadCategoriesForPostRow, error) {
	rows, err := q.db.Query(readCategoriesForPost, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ReadCategoriesForPostRow
	for rows.Next() {
		var i ReadCategoriesForPostRow
		if err := rows.Scan(
			&i.ID,
			&i.PostID,
			&i.CategoryID,
			&i.Name,
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

const readPostsForCategory = `
SELECT pc.post_id, p.title, p.body
FROM post_categories pc
JOIN posts p ON pc.post_id = p.id
WHERE pc.category_id = ?
`

type ReadPostsForCategoryRow struct {
	PostID int64  `json:"post_id"`
	Title  string `json:"title"`
	Body   string `json:"body"`
}

func (q *Queries) ReadPostsForCategory(categoryID int64) ([]ReadPostsForCategoryRow, error) {
	rows, err := q.db.Query(readPostsForCategory, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ReadPostsForCategoryRow
	for rows.Next() {
		var i ReadPostsForCategoryRow
		if err := rows.Scan(&i.PostID, &i.Title, &i.Body); err != nil {
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

const updatePostCategory = `
UPDATE post_categories
SET category_id = ?
WHERE post_id = ? AND category_id = ?
RETURNING id, post_id, category_id
`

type UpdatePostCategoryParams struct {
	CategoryID   int64 `json:"category_id"`
	PostID       int64 `json:"post_id"`
	CategoryID_2 int64 `json:"category_id_2"`
}

func (q *Queries) UpdatePostCategory(arg UpdatePostCategoryParams) (PostCategory, error) {
	row := q.db.QueryRow(updatePostCategory, arg.CategoryID, arg.PostID, arg.CategoryID_2)
	var i PostCategory
	err := row.Scan(&i.ID, &i.PostID, &i.CategoryID)
	return i, err
}
