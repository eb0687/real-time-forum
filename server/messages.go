package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"

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
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	// defer conn.Close()
	defer func() {
		delete(Users, conn)
		conn.Close()
	}()

	token := r.URL.Query().Get("token")
	fmt.Printf("token: %v\n", token)

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

	// Send the list of all users with their status to the connected client
	userStatuses, err := ws.GetAllUserStatus()
	if err != nil {
		SendErrorToWS(models.ErrInternalServerError, conn)
		return
	}

	data, err := json.Marshal(userStatuses)
	if err != nil {
		SendErrorToWS(models.ErrInternalServerError, conn)
		return
	}

	err = conn.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		panic(err)
	}

	// Handle websocket messages
	for {
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			SendErrorToWS(models.ErrInternalServerError, conn)
			// NOTE: had to break out of the loop else it panics
			// continue
			delete(Users, conn)
			break
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

		if dbMsg.Senderid == dbMsg.Receiverid {
			SendErrorToWS(models.ErrInternalServerError, conn)
			continue
		}
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

type UserStatus struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	Online   bool   `json:"online"`
}

func (ws *WebServer) GetAllUserStatus() ([]UserStatus, error) {
	allUsers, err := ws.DB.ReadAllUsers()
	if err != nil {
		panic(err)
	}

	userStatuses := []UserStatus{}
	for _, user := range allUsers {
		isOnline := getConnByUserID(user.ID) != nil
		userStatuses = append(userStatuses, UserStatus{
			ID:       user.ID,
			Username: user.Nickname,
			Online:   isOnline,
		})
	}
	return userStatuses, nil
}

func (ws *WebServer) GetHistory(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[database.GetHistoryParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	msgs, err := ws.DB.GetHistory(*data)
	if err != nil {
		panic(models.ErrInternalServerError)
	}

	err = utils.SendJsonResponse(w, http.StatusOK, msgs)
	if err != nil {
		panic(models.ErrInternalServerError)
	}
}
