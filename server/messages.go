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

var Users map[*websocket.Conn]database.User = make(map[*websocket.Conn]database.User)

func getConnByUserID(uid int64) *websocket.Conn {
	for conn, user := range Users {
		if user.ID == uid {
			return conn
		}
	}
	return nil
}

func (ws *WebServer) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println("1")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()
	token := r.URL.Query().Get("token")
	fmt.Printf("test: %v\n", token)

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

		// i can receive the data
		fmt.Println("Received data:", string(data))

		var dbMsg database.CreateMessageParams

		err = json.Unmarshal(data, &dbMsg)
		if err != nil {
			SendErrorToWS(models.ErrInvalidRequest, conn)
			continue
		}
		dbMsg.Senderid = user.ID

		fmt.Printf("Unmarshalled message: %+v\n", dbMsg)

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

		fmt.Printf("Sending to receiver (ID: %d): %s\n", msg.Receiverid, string(data))

		// add to db
		// db would generate times, from, who

		receiverConn := getConnByUserID(msg.Receiverid)
		if receiverConn == nil {
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
