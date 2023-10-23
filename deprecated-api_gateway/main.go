package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"grpcClient/internal/controller"
)

func main() {
	conn, err := grpc.Dial("localhost:18080", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	controller.RegisterClient(conn)
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Replace with your Vue.js app's domain in production
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api := router.Group("/api/v1")
	hk := api.Group("/housekeeper")
	hk.GET("", controller.FindAllHousekeeper)
	hk.GET("/:id", controller.FindHousekeeper)
	hk.POST("", controller.CreateHousekeeper)
	hk.PUT("/:id", controller.UpdateHousekeeper)
	hk.DELETE("/:id", controller.DeleteHousekeeper)
	router.Run("localhost:18000")
}
