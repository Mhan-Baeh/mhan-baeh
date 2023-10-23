package schemas

import (
	"time"
	"github.com/google/uuid"
)


type AppointmentRequestType struct {
	CustomerId    uuid.UUID         `json:"customer_id"`
	AddressId     uuid.UUID         `json:"address_id"`
	StartDateTime time.Time         `json:"start_date_time"`
	EndDateTime   time.Time         `json:"end_date_time"`
	Hour          int               `json:"hour"`
	Price         int               `json:"price"`
	Status        string `json:"status"`
	Note          string            `json:"note"`
	ToDoList      []string   `json:"to_do_list"` // array of uuid
}