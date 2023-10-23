package route

import (
	controller "housekeeper_service/controllers"
	repository "housekeeper_service/repositories"
	service "housekeeper_service/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func InitRestrouter(router *gin.Engine, db *gorm.DB) {
	housekeeperRepository := repository.NewHousekeeperRepository(db)
	housekeeperService := service.NewHousekeeperService(housekeeperRepository)
	housekeeperController := controller.NewHousekeeperController(housekeeperService)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	router.POST("/housekeeper", housekeeperController.CreateHousekeeper)
	router.POST("/housekeeper/login", housekeeperController.LoginHousekeeper)
	router.GET("/housekeeper/:uuid", housekeeperController.GetHousekeeperByUuid)
	router.GET("/housekeepers", housekeeperController.GetAllHousekeeper)
}
