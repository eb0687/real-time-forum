package server

import (
	"fmt"
	"net/http"
	"os"
	"real-time-forum/database"
	"real-time-forum/middlewares"
)

type WebServer struct {
	Mux http.Handler
	DB  *database.Queries
}

func (ws *WebServer) AddHandlers() {
	parent := http.NewServeMux()
	AddFileServer(parent)
	s := middlewares.CreateStack(
		middlewares.Logging,
		middlewares.Recovery,
	)

	// pp := http.NewServeMux()
	AddSubrouter(parent, "/auth", func(m *http.ServeMux) http.Handler {
		m.HandleFunc("/login", ws.LoginHandler)
		m.HandleFunc("/register", ws.RegisterHandler)
		m.HandleFunc("/logout", ws.LogoutHandler)
		return s(m)
	})

	AddSubrouter(parent, "/api", func(m *http.ServeMux) http.Handler {
		m.HandleFunc("POST /comments", ws.CreateComment)
		m.HandleFunc("GET /comments", ws.ReadAllComments)
		m.HandleFunc("GET /comments/{id}", ws.ReadCommentsByPostId)
		m.HandleFunc("PUT /comments/{id}", ws.UpdateComment)
		m.HandleFunc("DELETE /comments/{id}", ws.DeleteComment)

		m.HandleFunc("POST /posts", ws.CreatePost)
		m.HandleFunc("GET /posts", ws.ReadAllPosts)
		m.HandleFunc("GET /posts/{id}", ws.ReadPost)
		m.HandleFunc("PUT /posts/{id}", ws.UpdatePost)
		m.HandleFunc("DELETE /posts/{id}", ws.DeletePost)

		m.HandleFunc("GET /profile/{id}", ws.GetUserProfile)
		m.HandleFunc("GET /profile", ws.GetOwnUserProfile)

		m.HandleFunc("GET /users/{id}", ws.GetUserDetailsById)

		m.HandleFunc("GET /categories", ws.GetAllCategories)

		m.HandleFunc("POST /post-categories", ws.CreatePostCategory)
		m.HandleFunc("GET /post/{id}/categories", ws.GetAllCategoriesForPost)
		m.HandleFunc("GET /post-categories/{id}", ws.GetAllPostsForCategory)
		m.HandleFunc("DELETE /post-categories", ws.DeletePostCategory)

		m.HandleFunc("/cookie", ws.CheckCookie)

		return s(middlewares.Auth(m, ws.DB))
	})

	// WebSocket route under /api
	parent.HandleFunc("/ws", ws.HandleWebSocket)

	// Mount the API router at /api
	// parent.Handle("/api/", http.StripPrefix("/api", apiRouter))

	ws.Mux = parent
}

func AddSubrouter(parent *http.ServeMux, basePath string, f func(*http.ServeMux) http.Handler) {
	mux := http.NewServeMux()
	handler := f(mux)
	parent.Handle(basePath+"/", http.StripPrefix(basePath, handler))
}

func AddFileServer(mux *http.ServeMux) {
	fs := http.FileServer(http.Dir("./public"))
	mux.Handle("/public/", http.StripPrefix("/public/", fs))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("r.Cookies(): %v\n", r.Cookies())
		_, err := os.Stat(r.URL.Path)
		if err != nil && os.IsNotExist(err) {
			// w.WriteHeader(http.StatusNotFound)
			http.ServeFile(w, r, "public/index.html")
			return
		}
		http.ServeFile(w, r, "public"+r.URL.Path)
	})
}

func (ws *WebServer) WithAuthMiddleware() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/homepage", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Homepage")
	})

	router.HandleFunc("POST /comments", ws.CreateComment)
	router.HandleFunc("GET /comments", ws.ReadAllComments)
	router.HandleFunc("GET /comments/{id}", ws.ReadCommentsByPostId)
	router.HandleFunc("PUT /comments/{id}", ws.UpdateComment)
	router.HandleFunc("DELETE /comments/{id}", ws.DeleteComment)

	router.HandleFunc("POST /posts", ws.CreatePost)
	router.HandleFunc("GET /posts", ws.ReadAllPosts)
	router.HandleFunc("GET /posts/{id}", ws.ReadPost)
	router.HandleFunc("PUT /posts/{id}", ws.UpdatePost)
	router.HandleFunc("DELETE /posts/{id}", ws.DeletePost)

	router.HandleFunc("GET /profile/{id}", ws.GetUserProfile)
	router.HandleFunc("GET /profile", ws.GetOwnUserProfile)

	router.HandleFunc("GET /users/{id}", ws.GetUserDetailsById)

	router.HandleFunc("/cookie", ws.CheckCookie)
	return middlewares.Auth(router, ws.DB)
}
