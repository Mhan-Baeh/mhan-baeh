package http

import (
	"appointment_service/internal/services"
	postgresModel "appointment_service/internal/models/postgres"
	"github.com/gin-gonic/gin"
)


type AppointmentHandler struct {
	service *services.AppointmentService
}

func NewAppointmentHandler(service *services.AppointmentService) *AppointmentHandler {
	return &AppointmentHandler{service: service}
}


func (h *AppointmentHandler) GetAllAppointment(c *gin.Context) {
	appointments, err := h.service.GetAllAppointment()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"data": appointments})
}

func (h *AppointmentHandler) CreateAppointment(c *gin.Context) {
	var appointment postgresModel.Appointment

	err := c.ShouldBindJSON(&appointment)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.service.CreateAppointment(&appointment)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "OK"})
}