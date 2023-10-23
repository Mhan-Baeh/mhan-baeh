package services

import (
	"appointment_service/api/pb"
	postgresModel "appointment_service/internal/models/postgres"
	"appointment_service/internal/repo/mongo"
	"appointment_service/internal/repo/postgres"
	"errors"
	"time"

	"context"

	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	schema "appointment_service/internal/schemas"
)


type AppointmentService struct {
	appointmentRepo *postgres.AppointmentRepo
	jobRepo *mongo.JobRepo
	grpcClient *grpc.ClientConn
}

func NewAppointmentService(aptRepo *postgres.AppointmentRepo, jobRepo *mongo.JobRepo, grpcClient *grpc.ClientConn) *AppointmentService {
	return &AppointmentService{appointmentRepo: aptRepo, jobRepo: jobRepo, grpcClient: grpcClient}
}



func (s *AppointmentService) GetAllAppointment() ([]*schema.AppointmentReturnType, error) {
	var appointments []*schema.AppointmentReturnType
	dbAppointments,err := s.appointmentRepo.GetAllAppointment()
	if err != nil {
		return nil, err
	}
	
	client := pb.NewAddressServiceClient(s.grpcClient)
	for _, dbAppointment := range dbAppointments {
		
		// get address by id from grpc call to customer service
		log.Printf( "dbAppointment.AddressId.String(): %v", dbAppointment.AddressId.String())
		response,err := client.GetAddress(context.Background(), &pb.GetAddressRequest{
			AddressId: dbAppointment.AddressId.String(),
		})

		var address *schema.AddressReturnType
		if err != nil {
			log.Printf("error grpc hee: %v", err)
			address = &schema.AddressReturnType{
				AddressID:  "NOT FOUND",
				CustomerID: "NOT FOUND",
				Name:       "NOT FOUND",
				Address:    "NOT FOUND",
				Note:       "NOT FOUND",
				HouseSize:  "0",
			}
		} else {
			address = &schema.AddressReturnType{
				AddressID:  response.AddressId,
				CustomerID: response.CustomerId,
				Name:       response.Name,
				Address:    response.Address,
				Note:       response.Note,
				HouseSize:  response.HouseSize,
			}
		}
		
		// get housekeeper by id from grpc call to housekeeper service
		// TODO: implement grpc call to get housekeeper by id
		
		appointment := &schema.AppointmentReturnType{
			AppointmentId:  dbAppointment.AppointmentId,
			CustomerId:     dbAppointment.CustomerId,
			HousekeeperId:  dbAppointment.HousekeeperId,
			ToDoList:       dbAppointment.ToDoList,
			Price:          dbAppointment.Price,
			StartDateTime:  dbAppointment.StartDateTime,
			EndDateTime:    dbAppointment.EndDateTime,
			Status:         schema.AppointmentStatus(dbAppointment.Status),
			AddressId:      dbAppointment.AddressId,
			Address: 	  	address,
		}
		appointments = append(appointments, appointment)
	}
	return appointments, nil
}



func (s *AppointmentService) CreateAppointment(c context.Context,appointment *postgresModel.Appointment) error {
	// business checking logic

	// check valid customer by grpc call to customer service
	customerClient := pb.NewCustomerServiceClient(s.grpcClient)
	log.Printf("customerClient: %v", customerClient)
	customerResponse,err := customerClient.GetCustomer(context.Background(), &pb.GetCustomerRequest{
		CustomerId: appointment.CustomerId.String(),
	})
	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return err
	}
	log.Printf("customerResponse: %v", customerResponse)

	
	// check if address provided is valid by grpc call to customer service
	client := pb.NewAddressServiceClient(s.grpcClient)
	addressResponse,err := client.GetAddress(context.Background(), &pb.GetAddressRequest{
		AddressId: appointment.AddressId.String(),
	})
	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return err
	}
	log.Printf("addressResponse: %v", addressResponse)

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

	// calculate total price
	appointment.Price = appointment.Hour * 300

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