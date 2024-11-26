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
		panic(err)
	}
	fmt.Println("1")
	defer conn.Close()

	cookie, err := ws.DB.ReadCookieByUUID(r.URL.Query().Get("token"))
	if err != nil {
		panic(models.ErrUnauthorized)
	}
	// fmt.Println("2")
	// cookie := utils.GetAuthCookie(r)
	// if cookie == nil {
	// 	panic(models.ErrUnauthorized)
	// }

	user, err := ws.DB.ReadUser(cookie.Userid)
	if err != nil {
		panic(models.ErrUnauthorized)
	}
	fmt.Println("1")
	fmt.Printf("conn: %v\n", conn)
	fmt.Printf("user: %v\n", user)
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
		fmt.Println("1")

		var dbMsg database.CreateMessageParams
		err = json.Unmarshal(data, &dbMsg)
		if err != nil {
			SendErrorToWS(models.ErrInvalidRequest, conn)
			continue
			// panic(err)
		}
		fmt.Println("1")
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
		fmt.Println("1")

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
