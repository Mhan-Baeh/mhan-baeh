package controller

import (
	request "admin_service/schemas/requests"
	response "admin_service/schemas/responses"
	service "admin_service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AdminController interface {
	CreateAdmin(c *gin.Context)
	LoginAdmin(c *gin.Context)
}

type adminController struct {
	adminService service.AdminService
}

func NewAdminController(adminService service.AdminService) AdminController {
	return &adminController{
		adminService: adminService,
	}
}

func (adminController *adminController) CreateAdmin(c *gin.Context) {
	var request request.CreateAdminRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	err = adminController.adminService.CreateAdmin(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, nil)
}

func (adminController *adminController) LoginAdmin(c *gin.Context) {
	var request request.LoginAdminRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.NewBadRequest())
		return
	}
	data, err := adminController.adminService.LoginAdmin(&request)
	if err != nil {
		c.JSON(http.StatusForbidden, response.NewLoginError())
		return
	}
	res := &response.LoginAdminResponse{
		Success: true,
		Status:  http.StatusOK,
		Data:    data,
	}
	c.JSON(http.StatusOK, res)
}
