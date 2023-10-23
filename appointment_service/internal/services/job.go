package services

import (
	MongoModel "appointment_service/internal/models/mongo"
	"appointment_service/internal/repo/mongo"
	"log"

	"github.com/gin-gonic/gin"
)

type JobService struct {
	repo *mongo.JobRepo
}

func NewJobService(repo *mongo.JobRepo) *JobService {
	return &JobService{repo: repo}
}

func (s *JobService) CreateJob(c *gin.Context, job *MongoModel.Job) error {
	log.Printf("CreateJob service called")
	log.Println(job)
	return s.repo.CreateJob(c, job)
}

func (s *JobService) GetAllJob(c *gin.Context) ([]*MongoModel.Job, error) {
	log.Printf("GetAllJob service called")
	return s.repo.GetAllJob(c)
}
