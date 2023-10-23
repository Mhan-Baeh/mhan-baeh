package utils

import (
	"encoding/json"
)

func jsonFromString(s string) *json.RawMessage {
    b := json.RawMessage(s)
    return &b
}


