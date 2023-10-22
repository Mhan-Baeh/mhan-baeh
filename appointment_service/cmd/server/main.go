package main

import (
	"appointment_service/internal/config"
	"appointment_service/internal/infra/db"
	"appointment_service/internal/infra/server"
	"appointment_service/internal/repo/postgres"
	"appointment_service/internal/repo/mongo"
	"appointment_service/internal/handlers/http"
	"appointment_service/internal/services"
	"log"
)

func main() {
	cfg := config.NewConfig()
	log.Printf("Configuration: %+v", cfg)  // Add this line
	pgConn := db.InitPostgres(cfg.PostgresDSN)
	mongoConn := db.InitMongo(cfg.MongoDSN)

	pgRepo := postgres.NewAppointmentRepo(pgConn)
	mongoRepo := mongo.NewJobRepo(mongoConn, cfg.MongoDBName)

	apptService := services.NewAppointmentService(pgRepo)
	jobService := services.NewJobService(mongoRepo)

	apptHandler := http.NewAppointmentHandler(apptService)
	jobHandler := http.NewJobHandler(jobService)

	httpHandler := http.NewHandler(apptHandler, jobHandler)
	// grpcHandler := handler.NewGrpcHandler(apptService, jobService)

	httpServer := server.NewHTTPServer(httpHandler, cfg.HTTPPort)
	// grpcServer := server.NewGRPCServer(grpcHandler)

	// Run servers concurrently (for simplicity, error handling omitted)
	httpServer.Run()
	// grpcServer.Run()
}
