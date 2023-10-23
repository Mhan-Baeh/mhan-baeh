package kafka

import (
	"appointment_service/internal/config"
	postgresModel "appointment_service/internal/models/postgres"
	"context"
	"log"
	"time"

	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/segmentio/kafka-go"
)

type Producer struct {
	cfg *config.Config
}

func NewProducer(cfg *config.Config) *Producer {
	return &Producer{ cfg: cfg }
}

func (p *Producer) PushAppointment(c *gin.Context) {
	topic := "create_appointment"
	conn, err := kafka.DialLeader(context.Background(), "tcp", p.cfg.KafkaBroker, topic, 0)
	if err != nil {
		log.Fatalf("failed to dial leader: %v", err)
	}
	defer conn.Close()

	var appointment *postgresModel.Appointment

	err = c.ShouldBindJSON(&appointment)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	jsonData, err := json.Marshal(appointment)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to marshal appointment to JSON"})
		return
	}
	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	_, err = conn.WriteMessages(
		kafka.Message{Value: []byte(jsonData)},
	)
	if err != nil {
		log.Fatalf("failed to write messages: %v", err)
	}

	log.Println("Pushed messages to kafka")
	c.JSON(200, gin.H{"message": "OK"})

}