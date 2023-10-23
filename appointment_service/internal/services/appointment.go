package services

import (
	"appointment_service/api/pb"
	postgresModel "appointment_service/internal/models/postgres"
	"appointment_service/internal/repo/mongo"
	"appointment_service/internal/repo/postgres"
	"errors"
	"time"

	"context"

	uuidGofr "github.com/gofrs/uuid"
	uuidGoogle "github.com/google/uuid"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	schema "appointment_service/internal/schemas"
)

type AppointmentService struct {
	appointmentRepo *postgres.AppointmentRepo
	jobRepo         *mongo.JobRepo
	csClient        *grpc.ClientConn
	hkClient        *grpc.ClientConn
}

func NewAppointmentService(aptRepo *postgres.AppointmentRepo, jobRepo *mongo.JobRepo, csClient *grpc.ClientConn, hkClient *grpc.ClientConn) *AppointmentService {
	return &AppointmentService{appointmentRepo: aptRepo, jobRepo: jobRepo, csClient: csClient, hkClient: hkClient}
}

func (s *AppointmentService) GetAllAppointment() ([]*schema.AppointmentReturnType, error) {
	var appointments []*schema.AppointmentReturnType
	dbAppointments, err := s.appointmentRepo.GetAllAppointment()
	if err != nil {
		return nil, err
	}

	addressClient := pb.NewAddressServiceClient(s.csClient)
	housekeeperClient := pb.NewHousekeeperServiceClient(s.hkClient)
	customerClient := pb.NewCustomerServiceClient(s.csClient)

	for _, dbAppointment := range dbAppointments {

		log.Printf("customerClient: %v", customerClient)
		customerResponse, err := customerClient.GetCustomer(context.Background(), &pb.GetCustomerRequest{
			CustomerId: dbAppointment.CustomerId.String(),
		})
		

		var customer *schema.CustomerReturnType
		if err != nil {
			log.Printf("error grpc hee: %v", err)
			customer = &schema.CustomerReturnType{
				CustomerId: "NOT FOUND",
				Name:       "NOT FOUND",
				Phone:      "NOT FOUND",
				Email:      "NOT FOUND",
			}
		} else {
			customer = &schema.CustomerReturnType{
				CustomerId: customerResponse.CustomerId,
				Name:       customerResponse.Name,
				Phone:      customerResponse.Phone,
				Email:      customerResponse.Email,
			}
		}



		// get address by id from grpc call to customer service
		log.Printf("dbAppointment.AddressId.String(): %v", dbAppointment.AddressId.String())
		addressResponse, err := addressClient.GetAddress(context.Background(), &pb.GetAddressRequest{
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
				AddressID:  addressResponse.AddressId,
				CustomerID: addressResponse.CustomerId,
				Name:       addressResponse.Name,
				Address:    addressResponse.Address,
				Note:       addressResponse.Note,
				HouseSize:  addressResponse.HouseSize,
			}
		}

		// get housekeeper by id from grpc call to housekeeper service
		housekeeperResponse, err := housekeeperClient.GetHousekeeperByUuid(context.Background(), &pb.GetHousekeeperRequest{
			HousekeeperUuid: dbAppointment.HousekeeperId.String(),
		})

		var housekeeper *schema.HousekeeperReturnType
		if err != nil {
			log.Printf("error grpc hee: %v", err)
			housekeeper = &schema.HousekeeperReturnType{
				HousekeeperId: "NOT FOUND",
				Name:          "NOT FOUND",
				Phone:         "NOT FOUND",
				Email:         "NOT FOUND",
				Password:      "NOT FOUND",
			}
		} else {
			housekeeper = &schema.HousekeeperReturnType{
				HousekeeperId: housekeeperResponse.HousekeeperUuid,
				Name:          housekeeperResponse.Name,
				Phone:         housekeeperResponse.Phone,
				Email:         housekeeperResponse.Email,
				Password:      housekeeperResponse.Password,
			}
		}

		appointment := &schema.AppointmentReturnType{
			AppointmentId: dbAppointment.AppointmentId,
			CustomerId:    dbAppointment.CustomerId,
			HousekeeperId: dbAppointment.HousekeeperId,
			ToDoList:      dbAppointment.ToDoList,
			Price:         dbAppointment.Price,
			StartDateTime: dbAppointment.StartDateTime,
			EndDateTime:   dbAppointment.EndDateTime,
			Status:        schema.AppointmentStatus(dbAppointment.Status),
			AddressId:     dbAppointment.AddressId,
			Address:       address,
			Housekeeper:   housekeeper,
			Customer:      customer,
			CreatedAt:     dbAppointment.CreatedAt,
			UpdatedAt:     dbAppointment.UpdatedAt,
		}
		appointments = append(appointments, appointment)
	}
	return appointments, nil
}

func (s *AppointmentService) CreateAppointment(c context.Context, appointment *postgresModel.Appointment) error {
	// business checking logic

	// check valid customer by grpc call to customer service
	customerClient := pb.NewCustomerServiceClient(s.csClient)
	log.Printf("customerClient: %v", customerClient)
	customerResponse, err := customerClient.GetCustomer(context.Background(), &pb.GetCustomerRequest{
		CustomerId: appointment.CustomerId.String(),
	})
	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return err
	}
	log.Printf("customerResponse: %v", customerResponse)

	// check if address provided is valid by grpc call to customer service
	addressClient := pb.NewAddressServiceClient(s.csClient)
	addressResponse, err := addressClient.GetAddress(context.Background(), &pb.GetAddressRequest{
		AddressId: appointment.AddressId.String(),
	})
	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return err
	}
	log.Printf("addressResponse: %v", addressResponse)

	// get all housekeepers by grpc call to housekeeper service
	housekeeperClient := pb.NewHousekeeperServiceClient(s.hkClient)
	housekeeperResponse, err := housekeeperClient.GetAllHousekeepers(context.Background(), &pb.Empty{})
	if err != nil {
		log.Printf("error grpc hee: %v", err)

	}

	// convert housekeeperResponse to array of schema.HousekeeperReturnType
	var housekeeperResponseArr []*schema.HousekeeperReturnType
	for _, housekeeper := range housekeeperResponse.Housekeepers {
		housekeeperResponseArr = append(housekeeperResponseArr, &schema.HousekeeperReturnType{
			HousekeeperId: housekeeper.HousekeeperUuid,
			Name:          housekeeper.Name,
			Phone:         housekeeper.Phone,
			Email:         housekeeper.Email,
			Password:      housekeeper.Password,
		})
	}

	// get 1 free housekeeper with intersected time range
	// query in appointment table to get all intersected appointments
	startTime := appointment.StartDateTime.Format(time.RFC3339)
	endTime := appointment.EndDateTime.Format(time.RFC3339)
	intersectedAppointments, err := s.appointmentRepo.GetIntersectedAppointments(startTime, endTime)
	if err != nil {
		return err
	}

	log.Printf("intersectedAppointments: %v", intersectedAppointments)

	//  find housekeeper that is not in intersectedAppointments
	for _, housekeeper := range housekeeperResponseArr {
		isFree := true
		for _, intersectedAppointment := range intersectedAppointments {
			if housekeeper.HousekeeperId == intersectedAppointment.HousekeeperId.String() {
				isFree = false
				break
			}
		}

		if isFree {
			housekeeperUUID, err := uuidGofr.FromString(housekeeper.HousekeeperId)
			if err != nil {
				return err
			}
			appointment.HousekeeperId = housekeeperUUID
			break
		}
	}

	// if no free housekeeper, return error
	if appointment.HousekeeperId == uuidGofr.Nil {
		return errors.New("no free housekeeper")
	}

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

func (s *AppointmentService) UpdateAppointmentStatus(c context.Context, id string, status string) error {

	data, err := uuidGoogle.Parse(id)
	if err != nil {
		return err
	}
	dbAppointment, err := s.appointmentRepo.GetAppointmentById(data)
	if err != nil {
		return errors.New("appointment not found")
	}

	dbAppointment.Status = postgresModel.AppointmentStatus(status)

	return s.appointmentRepo.UpdateAppointment(dbAppointment)

}

func (s *AppointmentService) GetAppointmentById(id string) (*schema.AppointmentReturnType, error) {

	// convert id to uuid
	idUUID, err := uuidGoogle.Parse(id)
	if err != nil {
		return nil, err
	}
	// get appointment by id from postgres
	appointment, err := s.appointmentRepo.GetAppointmentById(idUUID)
	if err != nil {
		return nil, err
	}

	// get customer by id from grpc call to customer service

	customerClient := pb.NewCustomerServiceClient(s.csClient)
	log.Printf("customerClient: %v", customerClient)
	customerResponse, err := customerClient.GetCustomer(context.Background(), &pb.GetCustomerRequest{
		CustomerId: appointment.CustomerId.String(),
	})
	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return nil, err
	}
	// get address by id from grpc call to customer service
	addressClient := pb.NewAddressServiceClient(s.csClient)
	log.Printf("addressClient: %v", addressClient)
	addressResponse, err := addressClient.GetAddress(context.Background(), &pb.GetAddressRequest{
		AddressId: appointment.AddressId.String(),
	})
	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return nil, err
	}

	// get housekeeper by id from grpc call to housekeeper service
	housekeeperClient := pb.NewHousekeeperServiceClient(s.hkClient)
	housekeeperResponse, err := housekeeperClient.GetHousekeeperByUuid(context.Background(), &pb.GetHousekeeperRequest{
		HousekeeperUuid: appointment.HousekeeperId.String(),
	})

	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return nil, err
	}

	// get job by ids from mongo
	jobs, err := s.jobRepo.GetJobByIds(context.Background(), appointment.ToDoList)
	if err != nil {
		log.Printf("error grpc hee: %v", err)
		return nil, err
	}

	// convert jobs to array of schema.JobReturnType
	var jobsArr []*schema.JobReturnType
	for _, job := range jobs {
		jobsArr = append(jobsArr, &schema.JobReturnType{
			JobId:   job.JobId,
			JobName: job.JobName,
			JobRate: job.JobRate,
		})
	}

	// convert appointment to schema.AppointmentReturnType
	appointmentReturn := &schema.AppointmentReturnType{
		AppointmentId: appointment.AppointmentId,
		CustomerId:    appointment.CustomerId,
		HousekeeperId: appointment.HousekeeperId,
		ToDoList:      appointment.ToDoList,
		Price:         appointment.Price,
		StartDateTime: appointment.StartDateTime,
		EndDateTime:   appointment.EndDateTime,
		Status:        schema.AppointmentStatus(appointment.Status),
		AddressId:     appointment.AddressId,
		CreatedAt:     appointment.CreatedAt,
		UpdatedAt:     appointment.UpdatedAt,
		Address: &schema.AddressReturnType{
			AddressID:  addressResponse.AddressId,
			CustomerID: addressResponse.CustomerId,
			Name:       addressResponse.Name,
			Address:    addressResponse.Address,
			Note:       addressResponse.Note,
			HouseSize:  addressResponse.HouseSize,
		},
		Housekeeper: &schema.HousekeeperReturnType{
			HousekeeperId: housekeeperResponse.HousekeeperUuid,
			Name:          housekeeperResponse.Name,
			Phone:         housekeeperResponse.Phone,
			Email:         housekeeperResponse.Email,
		},
		Customer: &schema.CustomerReturnType{
			CustomerId: customerResponse.CustomerId,
			Name:       customerResponse.Name,
			Phone:      customerResponse.Phone,
			Email:      customerResponse.Email,
		},
		Job: jobsArr,
	}
	return appointmentReturn, nil
}
