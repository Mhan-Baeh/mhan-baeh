package model

import (
	"github.com/google/uuid"
)

type Admin struct {
	Admin_uuid uuid.UUID `gorm:"unique_index"`
	Email string `gorm:"unique_index"`
	Password string
	Name string
}


