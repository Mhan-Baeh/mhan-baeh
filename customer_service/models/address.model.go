package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Address struct {
	AddressID  uuid.UUID `gorm:"primaryKey" json:"address_id"`
	CustomerID uuid.UUID `json:"customer_id"`
	Name       string    `gorm:"size:128" json:"name"`
	Address    string    `gorm:"size:64" json:"address"`
	Note       string    `gorm:"size:64" json:"note"`
	HouseSize  int       `json:"house_size"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Address) TableName() string {
	return "addresses"
}

func (a *Address) Validate() error {
	if a.HouseSize < 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (a *Address) BeforeCreate(tx *gorm.DB) (err error) {
	// Validate the Address object before creating
	if err := a.Validate(); err != nil {
		return err
	}

	// Generate a new UUID for AddressID
	uuid, err := uuid.NewRandom()
	if err != nil {
		return err
	}
	a.AddressID = uuid

	return nil
}
