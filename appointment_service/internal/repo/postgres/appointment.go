package postgres

import (
	"gorm.io/gorm"
	postgreModel "appointment_service/internal/models/postgres"
)


type AppointmentRepo struct {
	db *gorm.DB
}

func NewAppointmentRepo(db *gorm.DB) *AppointmentRepo {
	return &AppointmentRepo{db: db}
}

func (r *AppointmentRepo) GetAllAppointment() ([]*postgreModel.Appointment, error) {
	var appointments []*postgreModel.Appointment
	err := r.db.Find(&appointments).Error
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

func (r *AppointmentRepo) CreateAppointment(appointment *postgreModel.Appointment) error {
	return r.db.Create(appointment).Error
}
