
package database

import (
)

const createCategory = `
INSERT INTO categories (name) VALUES (?) RETURNING id, name
`

func (q *Queries) CreateCategory(name string) (Category, error) {
	row := q.db.QueryRow(createCategory, name)
	var i Category
	err := row.Scan(&i.ID, &i.Name)
	return i, err
}

const deleteCategory = `
DELETE FROM categories WHERE id = ?
`

func (q *Queries) DeleteCategory(id int64) error {
	_, err := q.db.Exec(deleteCategory, id)
	return err
}

const readAllCategories = `
SELECT id, name FROM categories ORDER BY id
`

func (q *Queries) ReadAllCategories() ([]Category, error) {
	rows, err := q.db.Query(readAllCategories)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Category
	for rows.Next() {
		var i Category
		if err := rows.Scan(&i.ID, &i.Name); err != nil {
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

const readCategoryByID = `
SELECT id, name FROM categories WHERE id = ?
`

func (q *Queries) ReadCategoryByID(id int64) (Category, error) {
	row := q.db.QueryRow(readCategoryByID, id)
	var i Category
	err := row.Scan(&i.ID, &i.Name)
	return i, err
}

const updateCategory = `
UPDATE categories SET name = ? WHERE id = ? RETURNING id, name
`

type UpdateCategoryParams struct {
	Name string `json:"name"`
	ID   int64  `json:"id"`
}

func (q *Queries) UpdateCategory(arg UpdateCategoryParams) (Category, error) {
	row := q.db.QueryRow(updateCategory, arg.Name, arg.ID)
	var i Category
	err := row.Scan(&i.ID, &i.Name)
	return i, err
}
