package model

import (
	"github.com/google/uuid"
)

type Housekeeper struct {
	Housekeeper_uuid uuid.UUID `gorm:"unique_index"`
	Email            string    `gorm:"unique_index"`
	Password         string
	Name             string
	Phone            string
}
