
package database

import (
)

const createCookie = `
INSERT INTO cookies (
 userid,
 cookie
)
VALUES (?, ? )
RETURNING id
`

type CreateCookieParams struct {
	Userid int64  `json:"userid"`
	Cookie string `json:"cookie"`
}

func (q *Queries) CreateCookie(arg CreateCookieParams) (int64, error) {
	row := q.db.QueryRow(createCookie, arg.Userid, arg.Cookie)
	var id int64
	err := row.Scan(&id)
	return id, err
}

const deleteCookie = `
DELETE FROM cookies
WHERE id = ?
`

func (q *Queries) DeleteCookie(id int64) error {
	_, err := q.db.Exec(deleteCookie, id)
	return err
}

const readAllCookies = `
SELECT id, userid, cookie FROM cookies
`

func (q *Queries) ReadAllCookies() ([]Cookie, error) {
	rows, err := q.db.Query(readAllCookies)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Cookie
	for rows.Next() {
		var i Cookie
		if err := rows.Scan(&i.ID, &i.Userid, &i.Cookie); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const readCookie = `
SELECT id, userid, cookie
FROM cookies
WHERE id = ?
`

func (q *Queries) ReadCookie(id int64) (Cookie, error) {
	row := q.db.QueryRow(readCookie, id)
	var i Cookie
	err := row.Scan(&i.ID, &i.Userid, &i.Cookie)
	return i, err
}

const updateCookie = `
UPDATE cookies
SET userid = ?,
    cookie = ?
WHERE id = ?
`

type UpdateCookieParams struct {
	Userid int64  `json:"userid"`
	Cookie string `json:"cookie"`
	ID     int64  `json:"id"`
}

func (q *Queries) UpdateCookie(arg UpdateCookieParams) error {
	_, err := q.db.Exec(updateCookie, arg.Userid, arg.Cookie, arg.ID)
	return err
}
