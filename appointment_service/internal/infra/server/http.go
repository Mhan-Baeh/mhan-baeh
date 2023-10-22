package server

import (
	"appointment_service/internal/handlers/http"
	"github.com/gin-gonic/gin"
	"fmt"
	log "github.com/sirupsen/logrus"
)

type HTTPServer struct {
	handler *http.Handler
	port   string
}

func NewHTTPServer(handler *http.Handler, port string) *HTTPServer {
	return &HTTPServer{handler: handler, port: port}
}

func (s *HTTPServer) Run() {
	defaultRouter := gin.Default()
	// Define routes here
	router := defaultRouter.Group("/http")

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "OK",
		})
	})

	// mongo
	router.GET("/jobs", s.handler.JobHandler.GetAllJob)
	router.POST("/jobs", s.handler.JobHandler.CreateJob)

	// postgres
	router.GET("/appointments", s.handler.AppointmentHandler.GetAllAppointment)
	router.POST("/appointments", s.handler.AppointmentHandler.CreateAppointment)

	address := fmt.Sprintf(":%s", s.port)
    log.Printf("Starting HTTP server on %s", address) 
	err := defaultRouter.Run(address)   // Default port is :8004
	if err != nil {
		log.Fatalf("failed to start http server: %v", err)
	}
}
