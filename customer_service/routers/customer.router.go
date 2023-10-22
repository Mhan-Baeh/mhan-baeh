package routers

import (
	"grpcServer/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetCustomerRoutes(router *gin.RouterGroup, db *gorm.DB) {
	ctrls := controllers.DBController{Database: db}

	router.GET("customers", ctrls.GetCustomers)
	router.GET("customers/:id", ctrls.GetCustomer)
	router.POST("customers", ctrls.CreateCustomer)
	router.PUT("customers/:id", ctrls.UpdateCustomer)
	router.DELETE("customers/:id", ctrls.DeleteCustomer)
}
