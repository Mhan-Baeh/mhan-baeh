package main

import (
	"fmt"
	"grpcServer/models"
	"grpcServer/routers"
	"log"
	"net"
	"net/http"
	"os"
"grpcServer/pb"
	"grpcServer/controllers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	DB_URL := os.Getenv("DATABASE_URL")

	db, err := gorm.Open(postgres.Open(DB_URL), &gorm.Config{
		SkipDefaultTransaction: true,
	})

	if err != nil {
		log.Fatalf("Error while reading config file %s", err)
	}

	db.AutoMigrate(&models.Customer{}, &models.Address{})

	router := gin.New()
	api := router.Group("/api")
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "HELLO GOLANG RESTFUL API.",
		})
	})

	routers.SetCustomerRoutes(api, db)
	routers.SetAddressRoutes(api, db)
	controllers.DB = db

	PORT := os.Getenv("SERVER_PORT")

	port := fmt.Sprintf(":%v", PORT)
	fmt.Println("Server Running on Port", port)
	
	go http.ListenAndServe(port, router)
	listener, err := net.Listen("tcp", ":18081")
	if err != nil {
		panic(err)
	}
	
	s := grpc.NewServer()
	reflection.Register(s)
	
	pb.RegisterCustomerServiceServer(s, &controllers.CustomerServiceServer{})
	pb.RegisterAddressServiceServer(s, &controllers.AddressServiceServer{})

	if err := s.Serve(listener); err != nil {
		panic(err)
	}

}
