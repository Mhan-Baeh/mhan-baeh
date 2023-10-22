package services

import (
	"appointment_service/internal/repo/postgres"
	postgresModel "appointment_service/internal/models/postgres"
)


type AppointmentService struct {
	repo *postgres.AppointmentRepo
}

func NewAppointmentService(repo *postgres.AppointmentRepo) *AppointmentService {
	return &AppointmentService{repo: repo}
}

func (s *AppointmentService) GetAllAppointment() ([]*postgresModel.Appointment, error) {
	return s.repo.GetAllAppointment()
}

func (s *AppointmentService) CreateAppointment(appointment *postgresModel.Appointment) error {
	return s.repo.CreateAppointment(appointment)
}