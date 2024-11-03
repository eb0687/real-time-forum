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
    id,
    nickname,
    age,
    gender,
    first_name,
    last_name,
    email,
    password
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
    password = ?
WHERE
    id = ?;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = ?;

-- name: GetUserByEmailOrName :one
SELECT * FROM users WHERE ( nickname = ? OR email = ? );


-- name: Test :one





