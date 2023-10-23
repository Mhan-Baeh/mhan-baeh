package postgres

import (
	"github.com/gofrs/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"time"
)

type AppointmentStatus string

const (
	StatusBooked   AppointmentStatus = "BOOKED"
	StatusCleaning AppointmentStatus = "CLEANING"
	StatusDone     AppointmentStatus = "DONE"
	StatusCancelled AppointmentStatus = "CANCELLED"
)

type Appointment struct {
	AppointmentId uuid.UUID         `gorm:"type:uuid;primary_key;"`
	CustomerId    uuid.UUID         `gorm:"type:uuid;" json:"customer_id" binding:"required"`
	HousekeeperId uuid.UUID         `gorm:"type:uuid;" json:"housekeeper_id" binding:"required"`
	AddressId     uuid.UUID         `gorm:"type:uuid;" json:"address_id" binding:"required"`
	StartDateTime time.Time         `json:"start_date_time" binding:"required"`
	EndDateTime   time.Time         `json:"end_date_time" binding:"required"`
	Hour          int               `json:"hour"`
	Price         int               `json:"price"`
	Status        AppointmentStatus `json:"status" binding:"required,oneof=BOOKED CLEANING DONE CANCELLED"`
	Note          string            `json:"note"`
	ToDoList      pq.StringArray    `gorm:"type:text[];" json:"to_do_list"` // array of uuid
	CreatedAt     time.Time         `json:"created_at"`
	UpdatedAt     time.Time         `json:"updated_at"`
}

func (a *Appointment) Validate() error {
	if a.StartDateTime.After(a.EndDateTime) {
		return gorm.ErrInvalidData
	}

	return nil
}

func (a *Appointment) BeforeCreate(tx *gorm.DB) (err error) {
	// validate
	err = a.Validate()
	if err != nil {
		return err
	}
	// Generate a new UUID for AddressID
	id, err := uuid.NewV4()
	if err != nil {
		return err
	}
	a.AppointmentId = id

	// create_at
	a.CreatedAt = time.Now()
	a.UpdatedAt = time.Now()

	return nil
}
