package postgres

import (
	postgresModel "appointment_service/internal/models/postgres"

	"github.com/google/uuid"
	"gorm.io/gorm"
)


type AppointmentRepo struct {
	db *gorm.DB
}

func NewAppointmentRepo(db *gorm.DB) *AppointmentRepo {
	return &AppointmentRepo{db: db}
}

func (r *AppointmentRepo) GetAllAppointment() ([]*postgresModel.Appointment, error) {
	var appointments []*postgresModel.Appointment
	err := r.db.Find(&appointments).Error
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

func (r *AppointmentRepo) CreateAppointment(appointment *postgresModel.Appointment) error {
	return r.db.Create(appointment).Error
}

func (r *AppointmentRepo) GetIntersectedAppointments(startDateTime, endDateTime string) ([]*postgresModel.Appointment, error) {
	var appointments []*postgresModel.Appointment
	err := r.db.Where("(start_date_time < ? AND end_date_time > ?) OR (start_date_time < ? AND end_date_time > ?) OR (start_date_time >= ? AND end_date_time <= ?)", endDateTime, startDateTime, startDateTime, endDateTime, startDateTime, endDateTime).Find(&appointments).Error
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

func (r *AppointmentRepo) UpdateAppointment(appointment *postgresModel.Appointment) error {
	return r.db.Save(appointment).Error
}

func (r *AppointmentRepo) GetAppointmentById(id uuid.UUID) (*postgresModel.Appointment,error) {
	var appointment postgresModel.Appointment
	err := r.db.Where("appointment_id = ?", id).First(&appointment).Error
	if err != nil {
		return nil, err
	}

	return &appointment, nil
	
}