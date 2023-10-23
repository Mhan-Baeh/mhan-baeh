package schemas

import (
	"time"

	"github.com/gofrs/uuid"
	"github.com/lib/pq"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppointmentStatus string

const (
	StatusBooked    AppointmentStatus = "BOOKED"
	StatusCleaning  AppointmentStatus = "CLEANING"
	StatusDone      AppointmentStatus = "DONE"
	StatusCancelled AppointmentStatus = "CANCELLED"
)

type AddressReturnType struct {
	AddressID  string `json:"address_id"`
	CustomerID string `json:"customer_id"`
	Name       string `json:"name"`
	Address    string `json:"address"`
	Note       string `json:"note"`
	HouseSize  string `json:"house_size"`
}

type HousekeeperReturnType struct {
	HousekeeperId string `json:"housekeeper_id"`
	Name          string `json:"name"`
	Phone         string `json:"phone"`
	Email         string `json:"email"`
	Password      string `json:"password"`
}

type AppointmentReturnType struct {
	AppointmentId uuid.UUID         `json:"appointment_id"`
	CustomerId    uuid.UUID         `json:"customer_id"`
	HousekeeperId uuid.UUID         `json:"housekeeper_id"`
	AddressId     uuid.UUID         `json:"address_id"`
	StartDateTime time.Time         `json:"start_date_time"`
	EndDateTime   time.Time         `json:"end_date_time"`
	Hour          int               `json:"hour"`
	Price         int               `json:"price"`
	Status        AppointmentStatus `json:"status"`
	Note          string            `json:"note"`
	ToDoList      pq.StringArray    `json:"to_do_list"` // array of uuid
	CreatedAt     time.Time         `json:"created_at"`
	UpdatedAt     time.Time         `json:"updated_at"`

	Address     *AddressReturnType     `json:"address"`
	Housekeeper *HousekeeperReturnType `json:"housekeeper"`
	Customer    *CustomerReturnType    `json:"customer"`
	Job         []*JobReturnType       `json:"job"`
}

type JobReturnType struct {
	JobId   primitive.ObjectID `json:"job_id"`
	JobName string             `json:"job_name"`
	JobRate int                `json:"job_rate"`
}

type CustomerReturnType struct {
	CustomerId string `json:"customer_id"`
	Name       string `json:"name"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
}
