-- name: CreateCookie :one
INSERT INTO cookies (
 userid,
 cookie
)
VALUES (?, ? )
RETURNING *;

-- name: ReadCookie :one
SELECT id, userid, cookie
FROM cookies
WHERE id = ?;

-- name: ReadAllCookies :many
SELECT * FROM cookies;

-- name: UpdateCookie :exec
UPDATE cookies
SET userid = ?,
    cookie = ?
WHERE id = ?;

-- name: DeleteCookie :exec
DELETE FROM cookies
WHERE id = ?;

-- name: DeleteCookieByUserID :exec
DELETE FROM cookies
WHERE userid = ?;

-- name: ReadCookieByUserID :one
SELECT * FROM cookies WHERE userid = ?;
