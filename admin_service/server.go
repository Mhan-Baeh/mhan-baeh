package main

import (
	model "admin_service/models"
	route "admin_service/routes"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
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
		fmt.Println(err)
		panic("Failed to connect to database")
	}

	defer db.Close()

	db.AutoMigrate(&model.Admin{})

	r := gin.Default()

	route.InitRestrouter(r, db)

	r.Run(":" + SV_PORT)
}
