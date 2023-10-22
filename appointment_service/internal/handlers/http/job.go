package http

import (
	mongoModel "appointment_service/internal/models/mongo"
	"appointment_service/internal/services"

	"github.com/gin-gonic/gin"
)


type JobHandler struct {
	service *services.JobService
}

func NewJobHandler(service *services.JobService) *JobHandler {
	return &JobHandler{service: service}
}

func (h *JobHandler) CreateJob(c *gin.Context) {

	var job mongoModel.Job
	err := c.ShouldBindJSON(&job)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.service.CreateJob(c, &job)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "OK"})
}

func (h *JobHandler) GetAllJob(c *gin.Context) {
	jobs, err := h.service.GetAllJob(c)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"data": jobs})
}