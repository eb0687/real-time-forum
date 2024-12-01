-- name: CreateCategory :one
INSERT INTO categories (name) VALUES (?) RETURNING *;

-- name: ReadCategoryByID :one
SELECT * FROM categories WHERE id = ?;

-- name: ReadAllCategories :many
SELECT * FROM categories ORDER BY id;

-- name: UpdateCategory :one
UPDATE categories SET name = ? WHERE id = ? RETURNING *;

-- name: DeleteCategory :exec
DELETE FROM categories WHERE id = ?;
