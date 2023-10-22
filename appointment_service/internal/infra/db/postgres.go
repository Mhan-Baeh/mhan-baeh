package db

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	model "appointment_service/internal/models/postgres"
	log "github.com/sirupsen/logrus"
)

func InitPostgres(dsn string) *gorm.DB {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to postgres: %v", err)
	}
	
	err = db.AutoMigrate(&model.Appointment{})
	if err != nil {
		log.Fatalf("failed to migrate postgres: %v", err)
	}

	return db
}