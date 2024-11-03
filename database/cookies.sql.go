
package database

import (
)

const createCookie = `
INSERT INTO cookies (
 userid,
 cookie
)
VALUES (?, ? )
RETURNING id, userid, cookie
`

type CreateCookieParams struct {
	Userid int64  `json:"userid"`
	Cookie string `json:"cookie"`
}

func (q *Queries) CreateCookie(arg CreateCookieParams) (Cookie, error) {
	row := q.db.QueryRow(createCookie, arg.Userid, arg.Cookie)
	var i Cookie
	err := row.Scan(&i.ID, &i.Userid, &i.Cookie)
	return i, err
}

const deleteCookie = `
DELETE FROM cookies
WHERE id = ?
`

func (q *Queries) DeleteCookie(id int64) error {
	_, err := q.db.Exec(deleteCookie, id)
	return err
}

const deleteCookieByUUID = `
DELETE FROM cookies
WHERE cookie = ?
`

func (q *Queries) DeleteCookieByUUID(cookie string) error {
	_, err := q.db.Exec(deleteCookieByUUID, cookie)
	return err
}

const deleteCookieByUserID = `
DELETE FROM cookies
WHERE userid = ?
`

func (q *Queries) DeleteCookieByUserID(userid int64) error {
	_, err := q.db.Exec(deleteCookieByUserID, userid)
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

const readCookieByUserID = `
SELECT id, userid, cookie FROM cookies WHERE userid = ?
`

func (q *Queries) ReadCookieByUserID(userid int64) (Cookie, error) {
	row := q.db.QueryRow(readCookieByUserID, userid)
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
