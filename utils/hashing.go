package utils

import (
	"fmt"
	"net/http"
	"real-time-forum/database"
	"time"

	"github.com/gofrs/uuid/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashingPasswordFunc(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func CheckPasswordHashFunc(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func GenerateCookie(w http.ResponseWriter, userId int64, db *database.Queries) error {
	uid, err := uuid.NewV4()
	if err != nil {
		return err
	}

	_, err = db.CreateCookie(database.CreateCookieParams{
		Userid: userId,
		Cookie: uid.String(),
	})
	if err != nil {
		err := db.DeleteCookieByUserID(userId)
		if err != nil {
			return err
		}
		_, err = db.CreateCookie(database.CreateCookieParams{
			Userid: userId,
			Cookie: uid.String(),
		})
		if err != nil {
			return err
		}
	}

	cookie := http.Cookie{
		Name:     "auth_token",
		Value:    uid.String(),
		Path:     "/",
		MaxAge:   int(time.Hour),
		HttpOnly: false,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, &cookie)

	return nil
}
