package model

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dns := "host=localhost user=user password=password dbname=mhan-baeh port=5432"
	db, err := gorm.Open(postgres.Open(dns), &gorm.Config{})

	if err != nil {
		panic("Failed to connect db")
	}

	db.AutoMigrate(&Housekeeper{})
	DB = db
}
