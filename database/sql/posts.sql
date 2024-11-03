-- name: CreatePost :one
INSERT INTO posts (userid, title, body) VALUES (?, ?, ?) RETURNING *;


-- name: DeletePost :exec
DELETE FROM posts WHERE id = ?;

-- name: GetPostByID :one
SELECT * FROM posts WHERE id = ?;

-- name: UpdatePost :one
UPDATE posts SET title = ?, body = ? WHERE id = ? RETURNING *;


-- name: ReadAllPosts :many
SELECT * FROM posts ORDER BY created_at DESC;


-- name: ReadPostsByUserID :many
SELECT * FROM posts WHERE userid = ? ORDER BY created_at DESC;

-- name: ReadPostByID :one
SELECT * FROM posts WHERE id = ?;