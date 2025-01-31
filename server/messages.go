package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/database"
	"real-time-forum/models"
	"real-time-forum/utils"
	"slices"

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

func (ws *WebServer) NotifyAllClients() (e error) {
	// Send the list of all users with their status to the connected client
	userStatuses, err := ws.GetAllUserStatus()
	if err != nil {
		e = err
		return
	}

	data, err := json.Marshal(userStatuses)
	if err != nil {
		e = err
		return
	}

	for c := range Users {
		err := c.WriteMessage(websocket.TextMessage, data)
		if err != nil {
			e = err
			continue
		}
	}
	return e
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

		// notify the other users that this one have left
		userStatuses, err := ws.GetAllUserStatus()
		if err != nil {
			fmt.Printf("err: %v\n", err)
			SendErrorToWS(models.ErrInternalServerError, conn)
			return
		}
		data, err := json.Marshal(userStatuses)
		if err != nil {
			fmt.Printf("err: %v\n", err)
			SendErrorToWS(models.ErrInternalServerError, conn)
			return
		}
		for c := range Users {
			err := c.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				fmt.Printf("err: %v\n", err)
				continue
			}
		}
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

	ws.NotifyAllClients()

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
		return nil, err
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

type SortedUserList struct {
	User            UserStatus `json:"user"`
	LastMessageTime int        `json:"lastMessageTime"`
}

func (ws *WebServer) GetSortedUserList(w http.ResponseWriter, r *http.Request) {
	allUsers, err := ws.DB.ReadAllUsers()
	if err != nil {
		panic(models.ErrInternalServerError)
	}

	idk := []SortedUserList{}
	c, err := utils.GetCookieByUUID(r, ws.DB)
	if err != nil {
		panic(models.ErrInternalServerError)
	}
	for _, user := range allUsers {
		if c.Userid == user.ID {
			continue
		}

		lastmsgs, err := ws.DB.GetHistory(database.GetHistoryParams{
			Senderid:     c.Userid,
			Receiverid:   user.ID,
			Senderid_2:   user.ID,
			Receiverid_2: c.Userid,
			Limit:        1,
			Offset:       0,
		})
		if err != nil {
			panic(models.ErrInternalServerError)
		}
		var lmt int

		if len(lastmsgs) != 0 {
			lmt = int(lastmsgs[0].CreatedAt.Time.Unix())
		}
		isOnline := getConnByUserID(user.ID) != nil
		idk = append(idk, SortedUserList{
			User: UserStatus{
				ID:       user.ID,
				Username: user.Nickname,
				Online:   isOnline,
			},
			LastMessageTime: lmt,
		})
	}

	slices.SortFunc(idk, func(a, b SortedUserList) int {
		if a.LastMessageTime != 0 && b.LastMessageTime != 0 {
			return b.LastMessageTime - a.LastMessageTime // Most recent first
		}

		// If one user has no messages, put them after users with messages
		if a.LastMessageTime != 0 && b.LastMessageTime == 0 {
			return -1
		}
		if a.LastMessageTime == 0 && b.LastMessageTime != 0 {
			return 1
		}

		// If neither have messages, sort alphabetically by username
		if a.User.Username < b.User.Username {
			return -1
		} else if a.User.Username > b.User.Username {
			return 1
		}

		return 0
	})

	err = utils.SendJsonResponse(w, http.StatusOK, idk)
	if err != nil {
		panic(models.ErrInternalServerError)
	}
}

type CustomMessages struct {
	database.Message
	User database.User
}

func (ws *WebServer) GetHistory(w http.ResponseWriter, r *http.Request) {
	data, err := utils.DecodeRequestBody[database.GetHistoryParams](r)
	if err != nil {
		panic(models.ErrInvalidRequest)
	}

	msgs, err := ws.DB.GetHistory(*data)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		panic(models.ErrInternalServerError)
	}

	users := map[int64]database.User{}
	for _, msg := range msgs {
		if _, found := users[msg.Senderid]; found {
			continue
		}
		u, err := ws.DB.ReadUser(msg.Senderid)
		if err != nil {
			panic(models.ErrInternalServerError)
		}
		users[msg.Senderid] = u
		fmt.Printf("users[msg.Senderid]: %v\n", users[msg.Senderid])
	}

	newMsgs := []CustomMessages{}
	for _, msg := range msgs {
		newMsgs = append(newMsgs, CustomMessages{
			Message: msg,
			User:    users[msg.Senderid],
		})
	}

	err = utils.SendJsonResponse(w, http.StatusOK, newMsgs)
	if err != nil {
		panic(models.ErrInternalServerError)
	}
}
