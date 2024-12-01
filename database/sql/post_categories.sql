-- name: CreatePostCategory :one
INSERT INTO post_categories (post_id, category_id)
VALUES (?, ?)
RETURNING *;

-- name: ReadCategoriesForPost :many
SELECT pc.id, pc.post_id, pc.category_id, c.name
FROM post_categories pc
JOIN categories c ON pc.category_id = c.id
WHERE pc.post_id = ?;

-- name: ReadPostsForCategory :many
SELECT pc.post_id, p.title, p.body
FROM post_categories pc
JOIN posts p ON pc.post_id = p.id
WHERE pc.category_id = ?;

-- name: UpdatePostCategory :one
UPDATE post_categories
SET category_id = ?
WHERE post_id = ? AND category_id = ?
RETURNING *;

-- name: DeletePostCategory :exec
DELETE FROM post_categories
WHERE post_id = ? AND category_id = ?;

-- name: DeleteAllCategoriesForPost :exec
DELETE FROM post_categories WHERE post_id = ?;
