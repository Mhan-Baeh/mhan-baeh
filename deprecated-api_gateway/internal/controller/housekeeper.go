package controller

import (
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"grpcClient/internal/model"
	"grpcClient/pb"
	"net/http"
	"strconv"
)

var client pb.HousekeeperServiceClient

func RegisterClient(c *grpc.ClientConn) {
	client = pb.NewHousekeeperServiceClient(c)
}

func CreateHousekeeper(c *gin.Context) {
	var entity model.Housekeeper
	if err := c.ShouldBindJSON(&entity); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	h, _ := client.CreateHousekeeper(context.Background(), &pb.CreateHousekeeperRequest{
		Firstname: entity.Firstname,
		Lastname:  entity.Lastname,
		Phone:     entity.Phone,
	})

	entity.FromGRPC(*h)
	c.JSON(http.StatusCreated, gin.H{
		"data": entity,
	})
}

func FindHousekeeper(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var entity model.Housekeeper
	h, _ := client.GetHousekeeper(context.Background(), &pb.GetHousekeeperRequest{
		Id: int32(id),
	})
	entity.FromGRPC(*h)
	c.JSON(http.StatusOK, gin.H{
		"data": entity,
	})
}

func FindAllHousekeeper(c *gin.Context) {
	var entities []model.Housekeeper
	hs, _ := client.GetAllHousekeepers(context.Background(), &pb.GetAllHousekeeperRequest{})
	entities = make([]model.Housekeeper, len(hs.Housekeepers))
	for i := 0; i < len(hs.Housekeepers); i++ {
		entities[i].FromGRPC(*hs.Housekeepers[i])
	}
	c.JSON(http.StatusOK, gin.H{
		"data": entities,
	})
	return
}

func UpdateHousekeeper(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

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

	var entity model.Housekeeper
	h, err := client.UpdateHousekeeper(context.Background(), &pb.UpdateHousekeeperRequest{
		Housekeeper: &pb.Housekeeper{
			Id:        int32(id),
			Firstname: updateRequest.Firstname,
			Lastname:  updateRequest.Lastname,
			Phone:     updateRequest.Phone,
		},
	})
	if err != nil {
		fmt.Println("can't upate")
		panic(err)
	}
	entity.FromGRPC(*h)
	c.JSON(http.StatusOK, gin.H{
		"data": entity,
	})
	return
}

func DeleteHousekeeper(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	_, e := client.DeleteHousekeeper(context.Background(), &pb.DeleteHousekeeperRequest{Id: int32(id)})
	if e != nil {
		fmt.Println("can't delete")
		panic(e)
	}
	c.JSON(http.StatusOK, gin.H{
		"data": nil,
	})
}
