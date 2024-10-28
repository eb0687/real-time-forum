package server

import "net/http"

func AddHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/api/login", LoginHandler)

}
