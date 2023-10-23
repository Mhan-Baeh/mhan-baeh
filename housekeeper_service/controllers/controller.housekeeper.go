package controller

import (
	request "housekeeper_service/schemas/requests"
	response "housekeeper_service/schemas/responses"
	service "housekeeper_service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type HousekeeperController interface {
	CreateHousekeeper(c *gin.Context)
	LoginHousekeeper(c *gin.Context)
	GetHousekeeperByUuid(c *gin.Context)
	GetAllHousekeeper(c *gin.Context)
}

type housekeeperController struct {
	housekeeperService service.HousekeeperService
}

func NewHousekeeperController(housekeeperService service.HousekeeperService) HousekeeperController {
	return &housekeeperController{
		housekeeperService: housekeeperService,
	}
}

func (housekeeperController *housekeeperController) CreateHousekeeper(c *gin.Context) {
	var request request.CreateHousekeeperRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.NewBadRequest())
		return
	}
	housekeeperData, err := housekeeperController.housekeeperService.CreateHousekeeper(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.NewInternalServerError("Failed to create housekeeper"))
		return
	}
	c.JSON(http.StatusOK, housekeeperData)
}

func (housekeeperController *housekeeperController) LoginHousekeeper(c *gin.Context) {
	var request request.LoginHousekeeperRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.NewBadRequest())
		return
	}
	data, err := housekeeperController.housekeeperService.LoginHousekeeper(&request)
	if err != nil {
		c.JSON(http.StatusForbidden, response.NewLoginError())
		return
	}
	res := &response.HousekeeperResponse{
		Success: true,
		Status:  http.StatusOK,
		Data:    data,
	}
	c.JSON(http.StatusOK, res)
}

func (housekeeperController *housekeeperController) GetHousekeeperByUuid(c *gin.Context) {
	uuid := c.Param("uuid")
	housekeeperData, err := housekeeperController.housekeeperService.GetHousekeeperByUuid(uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.NewInternalServerError("Failed to get housekeeper"))
		return
	}
	res := &response.HousekeeperResponse{
		Success: true,
		Status:  http.StatusOK,
		Data:    housekeeperData,
	}
	c.JSON(http.StatusOK, res)
}

func (housekeeperController *housekeeperController) GetAllHousekeeper(c *gin.Context) {
	housekeeperData, err := housekeeperController.housekeeperService.GetAllHousekeeper()
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.NewInternalServerError("Failed to get housekeeper"))
		return
	}
	res := &response.HousekeeperResponse{
		Success: true,
		Status:  http.StatusOK,
		Data:    housekeeperData,
	}
	c.JSON(http.StatusOK, res)
}
