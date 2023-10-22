package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Customer struct {
	CustomerID uuid.UUID `gorm:"primaryKey" json:"customer_id"`
	Name       string    `gorm:"size:64" json:"name"`
	Phone      string    `gorm:"size:64" json:"phone"`
	Email      string    `gorm:"size:64" json:"email"`
	Password   string    `gorm:"size:64" json:"password"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	Addresses  []Address `gorm:"foreignKey:CustomerID"`
}

func (Customer) TableName() string {
	return "customers"
}

func (c *Customer) BeforeCreate(tx *gorm.DB) (err error) {
	uuid, err := uuid.NewRandom()
	if err != nil {
		return err
	}
	c.CustomerID = uuid
	return nil
}
