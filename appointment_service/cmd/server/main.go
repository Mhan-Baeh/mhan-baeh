package main

import (
	"appointment_service/internal/config"
	"appointment_service/internal/handlers/http"
	"appointment_service/internal/infra/db"
	"appointment_service/internal/infra/server"
	"appointment_service/internal/repo/mongo"
	"appointment_service/internal/repo/postgres"
	"appointment_service/internal/services"
	"log"

	"appointment_service/internal/infra/kafka"
	"appointment_service/internal/infra/client"
)

func main() {
	cfg := config.NewConfig()
	log.Printf("Configuration: %+v", cfg)  // Add this line
	pgConn := db.InitPostgres(cfg.PostgresDSN)
	mongoConn := db.InitMongo(cfg.MongoDSN)
	
	pgRepo := postgres.NewAppointmentRepo(pgConn)
	mongoRepo := mongo.NewJobRepo(mongoConn, cfg.MongoDBName)

	// grpc client
	csClient := client.NewGRPCClient(cfg.CustomerServiceGrpcHost)
	csClientConn, err := csClient.InitClient()
	if err != nil {
		log.Fatalf("failed to connect to grpc customer service client: %v", err)
	}

	hkClient := client.NewGRPCClient(cfg.HousekeeperServiceGrpcHost)
	hkClientConn, err := hkClient.InitClient()
	if err != nil {
		log.Fatalf("failed to connect to grpc housekeeper service client: %v", err)
	}
	
	apptService := services.NewAppointmentService(pgRepo,mongoRepo, csClientConn, hkClientConn)
	jobService := services.NewJobService(mongoRepo)

	apptHandler := http.NewAppointmentHandler(apptService)
	jobHandler := http.NewJobHandler(jobService)

	httpHandler := http.NewHandler(apptHandler, jobHandler)

	httpServer := server.NewHTTPServer(httpHandler, cfg.HTTPPort)




	// Run servers concurrently (for simplicity, error handling omitted)
	go httpServer.Run(&cfg)

	consumer := kafka.NewConsumer(apptService, &cfg)
	consumer.Start()
}