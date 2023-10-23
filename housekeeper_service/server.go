package main

import (
	"fmt"
	model "housekeeper_service/models"
	route "housekeeper_service/routes"
	"log"
	"net"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	grpcController "housekeeper_service/grpc"
	pb "housekeeper_service/pb"
)

func main() {
	env_err := godotenv.Load(".env")
	if env_err != nil {
		log.Fatalf("Error loading .env file: %v", env_err)
	}

	SV_PORT := os.Getenv("SV_PORT")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbName := os.Getenv("DB_NAME")
	dbPassword := os.Getenv("DB_PASSWORD")

	dbURI := "host=" + dbHost + " port=" + dbPort + " user=" + dbUser + " dbname=" + dbName + " sslmode=disable" + " password=" + dbPassword
	fmt.Println(dbURI)
	db, err := gorm.Open("postgres", dbURI)
	if err != nil {
		panic("Failed to connect to database")
	}

	defer db.Close()

	db.AutoMigrate(&model.Housekeeper{})

	r := gin.Default()

	route.InitRestrouter(r, db)

	go r.Run(":" + SV_PORT)

	listener, err := net.Listen("tcp", ":18081")
	if err != nil {
		panic(err)
	}

	s := grpc.NewServer()
	reflection.Register(s)

	pb.RegisterHousekeeperServiceServer(s, &grpcController.HousekeeperServiceServer{})

	if err := s.Serve(listener); err != nil {
		panic(err)
	}
}
