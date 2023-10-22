package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"grpcServer/models"
	"grpcServer/routers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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

	PORT := os.Getenv("SERVER_PORT")

	port := fmt.Sprintf(":%v", PORT)
	fmt.Println("Server Running on Port", port)
	http.ListenAndServe(port, router)
}
