package kafka

import (
	"appointment_service/internal/config"
	"appointment_service/internal/schemas"
	"appointment_service/internal/services"
	"context"
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
)

type Consumer struct {
	Service *services.AppointmentService
	cfg     *config.Config
}

func NewConsumer(service *services.AppointmentService, cfg *config.Config) *Consumer {
	return &Consumer{Service: service, cfg: cfg}
}

func (c *Consumer) Start() {

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{c.cfg.KafkaBroker},
		Topic:     "create_appointment",
		Partition: 0,
		GroupID:   "appointment_consumers", // Add this line to join a consumer group
		MinBytes:  10e3,                    // 10KB
		MaxBytes:  10e6,                    // 10MB
	})

	
	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Fatalf("Failed to read message: %v", err)
		}

		log.Printf("Received message: %s", string(m.Value))

		// Process the message to create an appointment
		var appointment schemas.AppointmentRequestType

		// Unmarshal the JSON message into the appointment struct
		err = json.Unmarshal(m.Value, &appointment)
		if err != nil {
			log.Printf("Failed to unmarshal message: %v", err)
			continue // skip processing this message and move to the next
		}

		// call service to create appointment
		err = c.Service.CreateAppointment(context.Background(), &appointment)
		if err != nil {
			log.Printf("Failed to create appointment: %v", err)
		}
	}
}
