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
WHERE (senderid = ? AND receiverid = ?) OR (senderid = ? AND receiverid = ?);


-- name: DeleteMessage :exec
DELETE FROM Messages
WHERE id = ?;
