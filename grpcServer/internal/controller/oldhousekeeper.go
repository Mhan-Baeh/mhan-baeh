package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"grpcServer/internal/model"
	"net/http"
)

func CreateHousekeeper(c *gin.Context) {
	var entity model.Housekeeper
	if err := c.ShouldBindJSON(&entity); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	tx := model.DB.Create(&entity)
	fmt.Println(tx)
	c.JSON(http.StatusCreated, gin.H{
		"data": entity,
	})
}

func FindHousekeeper(c *gin.Context) {
	id := c.Param("id")
	var entity model.Housekeeper
	if err := model.DB.Where("id = ?", id).First(&entity).Error; err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": entity,
	})
}

func FindAllHousekeeper(c *gin.Context) {
	var entities []model.Housekeeper
	model.DB.Find(&entities)

	c.JSON(http.StatusOK, gin.H{
		"data": entities,
	})
	return
}

func UpdateHousekeeper(c *gin.Context) {
	id := c.Param("id")
	var entity model.Housekeeper

	if err := model.DB.Where("id = ?", id).First(&entity).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}

	updateRequest := struct {
		Firstname string `json:"firstname,omitempty"`
		Lastname  string `json:"lastname,omitempty"`
		Phone     string `json:"phone,omitempty"`
	}{}

	if err := c.ShouldBindJSON(&updateRequest); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	fmt.Println(updateRequest)

	entity.Firstname = updateRequest.Firstname
	entity.Lastname = updateRequest.Lastname
	entity.Phone = updateRequest.Phone

	model.DB.Model(&entity).Updates(&entity)
	c.JSON(http.StatusOK, gin.H{
		"data": entity,
	})
	return
}

func DeleteHousekeeper(c *gin.Context) {
	id := c.Param("id")
	var entity model.Housekeeper
	if err := model.DB.Where("id = ?", id).First(&entity).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}

	model.DB.Delete(&entity)
	c.JSON(http.StatusOK, gin.H{
		"data": nil,
	})
}
