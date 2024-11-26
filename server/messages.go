package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"

	"github.com/gorilla/websocket"
)

// INITIALIZE
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// type User struct {
// 	*database.User
// 	Conn *websocket.Conn
// }

var Users map[*websocket.Conn]database.User

func getConnByUserID(uid int64) *websocket.Conn {
	for conn, user := range Users {
		if user.ID == uid {
			return conn
		}
	}
	return nil
}

func (ws *WebServer) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	cookie, err := ws.DB.ReadCookieByUUID(r.URL.Query().Get("token"))
	if err != nil {
		fmt.Println(models.ErrUnauthorized)
		return
	}

	user, err := ws.DB.ReadUser(cookie.Userid)
	if err != nil {
		fmt.Println(models.ErrUnauthorized)
		return
	}
	Users[conn] = user
	defer conn.Close()

	// Handle websocket messages
	for {
		// send something like this in js
		// {
		// 	"message": "Hello, World!",
		//  "to": "user1"
		// }
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			SendErrorToWS(models.ErrInternalServerError, conn)
			continue
		}

		var dbMsg database.CreateMessageParams
		err = json.Unmarshal(data, &dbMsg)
		if err != nil {
			SendErrorToWS(models.ErrInvalidRequest, conn)
			continue
			// fmt.Println(err)
		}
		dbMsg.Senderid = user.ID

		msg, err := ws.DB.CreateMessage(dbMsg)
		if err != nil {
			SendErrorToWS(models.ErrInternalServerError, conn)
			continue
		}

		data, err = json.Marshal(msg)
		if err != nil {
			SendErrorToWS(models.ErrInternalServerError, conn)
			continue
		}

		// add to db
		// db would generate times, from, who

		fmt.Printf("Received from client: %s\n", data)
		receiverConn := getConnByUserID(msg.Receiverid)
		if conn == nil {
			SendErrorToWS(models.ErrUserNotFound, conn)
			// send to db
			continue
		}

		if err := receiverConn.WriteMessage(messageType, data); err != nil {
			SendErrorToWS(models.ErrInternalServerError, conn)
			continue
		}

		// send db response
		if err := conn.WriteMessage(messageType, data); err != nil {
			SendErrorToWS(models.ErrInternalServerError, conn)
			continue
		}

	}
}

func SendErrorToWS(err error, conn *websocket.Conn) {
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte(err.Error()))
	}
}
