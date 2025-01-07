-- name: CreatePost :one
INSERT INTO posts (userid, title, body) VALUES (?, ?, ?) RETURNING *;


-- name: DeletePost :exec
DELETE FROM posts WHERE id = ?;

-- name: GetPostByID :one
SELECT * FROM posts WHERE id = ?;

-- name: UpdatePost :one
UPDATE posts SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *;


-- name: ReadAllPosts :many
SELECT posts.*, users.nickname 
FROM posts 
JOIN users ON posts.userid = users.id
ORDER BY posts.created_at DESC;


-- name: ReadPostsByUserID :many
SELECT * FROM posts WHERE userid = ? ORDER BY created_at DESC;

-- name: ReadPostByID :one
SELECT * FROM posts WHERE id = ?;
