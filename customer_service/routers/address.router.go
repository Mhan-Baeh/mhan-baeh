package routers

import (
	"grpcServer/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetAddressRoutes(router *gin.RouterGroup, db *gorm.DB) {
	ctrls := controllers.DBController{Database: db}

	router.GET("addresses/customers/:customer_id/", ctrls.GetAddressesForCustomer)
	router.GET("addresses", ctrls.GetAddresses)
	router.GET("addresses/:id", ctrls.GetAddress)
	router.POST("customers/:customer_id/addresses", ctrls.CreateAddress)
	router.PUT("addresses/:id", ctrls.UpdateAddress)
	router.DELETE("addresses/:id", ctrls.DeleteAddress)
}
