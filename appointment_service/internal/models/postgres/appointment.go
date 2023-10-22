package postgres

import (
	"time"
	"github.com/lib/pq"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type Appointment struct {
	AppointmentId uuid.UUID   `gorm:"type:uuid;primary_key;"`
	CustomerId    uuid.UUID   `gorm:"type:uuid;" json:"customer_id"`
	HousekeeperId uuid.UUID   `gorm:"type:uuid;" json:"housekeeper_id"`
	AddressId     uuid.UUID   `gorm:"type:uuid;" json:"address_id"`
	StartDateTime time.Time   `json:"start_date_time"`
	EndDateTime   time.Time   `json:"end_date_time"`
	Hour          int         `json:"hour"`
	Price         int         `json:"price"`
	Status        string      `json:"status"`
	Note          string      `json:"note"`
	ToDoList      pq.StringArray `gorm:"type:text[];" json:"to_do_list"` // array of uuid
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
}

func (a *Appointment) BeforeCreate(tx *gorm.DB) (err error) {

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
