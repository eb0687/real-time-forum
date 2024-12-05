
package database

import (
)

const createMessage = `
INSERT INTO Messages (
    body,
    senderid,
    receiverid
)
VALUES (?, ?, ?)
RETURNING id, senderid, receiverid, body, created_at, updated_at, "foreign"
`

type CreateMessageParams struct {
	Body       string `json:"body"`
	Senderid   int64  `json:"senderid"`
	Receiverid int64  `json:"receiverid"`
}

func (q *Queries) CreateMessage(arg CreateMessageParams) (Message, error) {
	row := q.db.QueryRow(createMessage, arg.Body, arg.Senderid, arg.Receiverid)
	var i Message
	err := row.Scan(
		&i.ID,
		&i.Senderid,
		&i.Receiverid,
		&i.Body,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Foreign,
	)
	return i, err
}

const deleteMessage = `
DELETE FROM Messages
WHERE id = ?
`

func (q *Queries) DeleteMessage(id int64) error {
	_, err := q.db.Exec(deleteMessage, id)
	return err
}

const getHistory = `
SELECT id, senderid, receiverid, body, created_at, updated_at, "foreign" FROM Messages
WHERE (senderid = ? AND receiverid = ?)
   OR (senderid = ? AND receiverid = ?)
ORDER BY created_at DESC
LIMIT ?
OFFSET ?
`

type GetHistoryParams struct {
	Senderid     int64 `json:"senderid"`
	Receiverid   int64 `json:"receiverid"`
	Senderid_2   int64 `json:"senderid_2"`
	Receiverid_2 int64 `json:"receiverid_2"`
	Limit        int64 `json:"limit"`
	Offset       int64 `json:"offset"`
}

func (q *Queries) GetHistory(arg GetHistoryParams) ([]Message, error) {
	rows, err := q.db.Query(getHistory,
		arg.Senderid,
		arg.Receiverid,
		arg.Senderid_2,
		arg.Receiverid_2,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Message
	for rows.Next() {
		var i Message
		if err := rows.Scan(
			&i.ID,
			&i.Senderid,
			&i.Receiverid,
			&i.Body,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Foreign,
		); err != nil {
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

const readChat = `
SELECT id, senderid, receiverid, body, created_at, updated_at, "foreign" FROM Messages
WHERE (senderid = ? AND receiverid = ?)
`

type ReadChatParams struct {
	Senderid   int64 `json:"senderid"`
	Receiverid int64 `json:"receiverid"`
}

func (q *Queries) ReadChat(arg ReadChatParams) ([]Message, error) {
	rows, err := q.db.Query(readChat, arg.Senderid, arg.Receiverid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Message
	for rows.Next() {
		var i Message
		if err := rows.Scan(
			&i.ID,
			&i.Senderid,
			&i.Receiverid,
			&i.Body,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Foreign,
		); err != nil {
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
