-- name: CreateUser :one
INSERT INTO
    users (
        nickname,
        age,
        gender,
        first_name,
        last_name,
        email,
        password
    )
VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *;

-- name: ReadUser :one
SELECT
*
FROM users
WHERE
    id = ?;

-- name: ReadAllUsers :many
SELECT * FROM users;

-- name: UpdateUser :exec
UPDATE users
SET
    nickname = ?,
    age = ?,
    gender = ?,
    first_name = ?,
    last_name = ?,
    email = ?,
    password = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE
    id = ?;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = ?;

-- name: GetUserByEmailOrName :one
SELECT * FROM users WHERE ( nickname = ? OR email = ? );


-- name: Test :one





