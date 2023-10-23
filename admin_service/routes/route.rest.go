package route

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	repository "admin_service/repositories"
	service "admin_service/services"
	controller "admin_service/controllers"
)

func InitRestrouter(router *gin.Engine, db *gorm.DB) {
	adminRepository := repository.NewAdminRepository(db)
	adminService := service.NewAdminService(adminRepository)
	adminController := controller.NewAdminController(adminService)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	router.POST("/admin", adminController.CreateAdmin)
	router.POST("/admin/login", adminController.LoginAdmin)
}
