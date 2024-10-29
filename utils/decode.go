package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/models"
	"reflect"
)

func DecodeRequestBody[T any](r *http.Request) (*T, error) {
	var data T
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

func SendJsonResponse(w http.ResponseWriter, status int, data any) error {
	dataType := reflect.TypeOf(data).Kind()
	if dataType != reflect.Struct && dataType != reflect.Map && dataType != reflect.Slice {
		return fmt.Errorf("data must be a struct, map, or slice")
	}
	w.WriteHeader(status)
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		return err
	}
	return nil
}

func SendCustomError(w http.ResponseWriter, err models.CustomError) {
	SendJsonResponse(w, err.Status, err)
}
