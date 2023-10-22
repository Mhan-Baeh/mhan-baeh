package kafka

import (
	"context"
	"log"
	"appointment_service/internal/services"

	"github.com/segmentio/kafka-go"
)

type Consumer struct {
	Service *services.AppointmentService
}

func (c *Consumer) Start() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{"localhost:9092"},
		Topic:     "create_appointment",
		Partition: 0,
	})

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Fatalf("Failed to read message: %v", err)
		}

		log.Printf("Received message: %s", string(m.Value))
		// Process the message to create an appointment
		// err = c.Service.CreateAppointment(string(m.Value))
		// if err != nil {
		// 	log.Printf("Failed to create appointment: %v", err)
		// }
	}
}
