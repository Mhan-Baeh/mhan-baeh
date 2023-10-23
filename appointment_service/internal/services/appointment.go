package services

import (
	postgresModel "appointment_service/internal/models/postgres"
	"appointment_service/internal/repo/mongo"
	"appointment_service/internal/repo/postgres"
	"errors"
	"time"

	"context"

	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)


type AppointmentService struct {
	appointmentRepo *postgres.AppointmentRepo
	jobRepo *mongo.JobRepo

}

func NewAppointmentService(aptRepo *postgres.AppointmentRepo, jobRepo *mongo.JobRepo) *AppointmentService {
	return &AppointmentService{appointmentRepo: aptRepo, jobRepo: jobRepo}
}

func (s *AppointmentService) GetAllAppointment() ([]*postgresModel.Appointment, error) {
	return s.appointmentRepo.GetAllAppointment()
}



func (s *AppointmentService) CreateAppointment(c context.Context,appointment *postgresModel.Appointment) error {
	// business checking logic

	// check valid customer by grpc call to customer service
	// TODO: implement grpc call to get customer by id

	
	// check if address provided is valid by grpc call to customer service
	// TODO: implement grpc call to get address by id


	// get all housekeepers by grpc call to housekeeper service
	// TODO: implement grpc call to get all housekeepers

	// get 1 free housekeeper with intersected time range
	// query in appointment table to get all intersected appointments
	startTime := appointment.StartDateTime.Format(time.RFC3339)
	endTime := appointment.EndDateTime.Format(time.RFC3339)
	intersectedAppointments, err := s.appointmentRepo.GetIntersectedAppointments(startTime, endTime)
	if err != nil {
		return err
	}

	log.Printf("intersectedAppointments: %v", intersectedAppointments)

	/*
	 find housekeeper that is not in intersectedAppointments
	for _, housekeeper := range __housekeeper_from_grpc_call__ {
		isFree := true
		for _, intersectedAppointment := range intersectedAppointments {
			if housekeeper.housekeeperId == intersectedAppointment.HousekeeperId {
				isFree = false
				break
			}
		}

		if isFree {
			appointment.HousekeeperId = housekeeper.housekeeperId
			break
		}
	}

	if no free housekeeper, return error
	if appointment.HousekeeperId == uuid.Nil {
		return errors.New("no free housekeeper")
	}
	*/


	// validate to do list by query with repo to get to do lists
	todoList, err := s.jobRepo.GetJobByIds(c, appointment.ToDoList)
	if err != nil {
		return err
	}

	log.Printf("appointment.ToDoList: %v", appointment.ToDoList)
	log.Printf("todolist: %v", todoList)
	log.Printf("len(todoList): %v", len(todoList))
	log.Printf("len(appointment.ToDoList): %v", len(appointment.ToDoList))

	if len(todoList) != len(appointment.ToDoList) {
		return errors.New("invalid to do list")
	}

	return s.appointmentRepo.CreateAppointment(appointment)
}

func (s *AppointmentService) UpdateAppointmentStatus(c context.Context,id string, status string) error {


	data , err := uuid.Parse(id)
	if err != nil {
		return err
	}
	dbAppointment,err := s.appointmentRepo.GetAppointmentById(data)
	if err != nil {
		return errors.New("appointment not found")
	}

	dbAppointment.Status = postgresModel.AppointmentStatus(status)

	return s.appointmentRepo.UpdateAppointment(dbAppointment)

}