-- name: CreateComment :one
INSERT INTO comments (
 userid,
 postid,
 body
)
VALUES (?, ?, ? )
RETURNING *;

-- name: ReadCommentbyID :one
SELECT * FROM comments WHERE id = ?;

-- name: ReadCommentsbyPostID :many
SELECT * FROM comments WHERE postid = ? ORDER BY created_at DESC;

-- name: ReadAllComments :many
SELECT * FROM comments ORDER BY created_at DESC;

-- name: GetCommentbyID :one
SELECT * FROM comments WHERE id = ?;

-- name: UpdateComment :one
UPDATE comments SET body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *;

-- name: DeleteComment :exec
DELETE FROM comments WHERE id = ?;
