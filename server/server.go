package server

import (
	"net/http"
	"real-time-forum/database"
)

type WebServer struct {
	Mux http.Handler
	DB  *database.Queries
}

func (ws *WebServer) AddHandlers() {
	parent := http.NewServeMux()

	parent.HandleFunc("/ws", ws.HandleWebSocket)

	ws.Mux = parent
}
