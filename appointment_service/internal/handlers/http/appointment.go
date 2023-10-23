package http

import (
	postgresModel "appointment_service/internal/models/postgres"
	"appointment_service/internal/services"
	"log"

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

	err = h.service.CreateAppointment(c, &appointment)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "OK"})
}

func (h *AppointmentHandler) UpdateAppointmentStatus(c *gin.Context) {
	var id string = c.Param("id")
	log.Default().Println(id)
	type Status struct {
		Status string `json:"status" binding:"required,oneof=DONE CANCELLED BOOKED CLEANING"`
	}
	var status Status
	err := c.ShouldBindJSON(&status)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.service.UpdateAppointmentStatus(c, id, status.Status)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "OK"})
}