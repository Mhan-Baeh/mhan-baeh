package config

import (
	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
)

type Config struct {
	HTTPPort string `env:"HTTPPort" envDefault:"8004"`
	// DB
	DBHost        string `env:"DB_HOST" envDefault:"localhost"`
	DBPort        string `env:"DB_PORT" envDefault:"5432"`
	DBUser        string `env:"DB_USER" envDefault:"user"`
	DBName        string `env:"DB_NAME" envDefault:"appointment_service"`
	DBPassword    string `env:"DB_PASSWORD" envDefault:"password"`
	DBSslMode     string `env:"DB_SSLMODE" envDefault:"disable"`
	PostgresDSN   string `env:"POSTGRES_DSN" envDefault:"postgres://user:password@localhost:5432/appointment_service?sslmode=disable"`
	MongoDSN	  string `env:"MONGO_DSN" envDefault:"mongodb://user:password@localhost:27016"`
	MongoDBName   string `env:"MONGO_DB_NAME" envDefault:"appointment_service"`
	KafkaBroker   string `env:"KAFKA_BROKER" envDefault:"localhost:9092"`
}

func NewConfig() Config {
	godotenv.Load()
	config := Config{}
	if err := env.Parse(&config); err != nil {
		log.Errorf("%+v\n", err)
	}
	return config
}