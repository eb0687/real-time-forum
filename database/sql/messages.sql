-- name: CreateMessage :one
INSERT INTO Messages (
    body,
    senderid,
    receiverid
)
VALUES (?, ?, ?)
RETURNING *;

-- name: ReadChat :many
SELECT * FROM Messages
WHERE (senderid = ? AND receiverid = ?);


-- name: DeleteMessage :exec
DELETE FROM Messages
WHERE id = ?;

-- name: GetHistory :many
SELECT *
FROM Messages
WHERE
    senderid = ? AND receiverid = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?
