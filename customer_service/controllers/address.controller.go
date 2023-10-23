package controllers

import (
	"context"
	"grpcServer/models"
	"grpcServer/pb"
	"log"
	"net"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AddressServiceServer struct {
	pb.UnimplementedAddressServiceServer
}

func RegisterAddressService(s *grpc.Server, l *net.Listener) {
	pb.RegisterAddressServiceServer(s, &AddressServiceServer{})
	if err := s.Serve(*l); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func (s AddressServiceServer) GetCustomer(ctx context.Context, request *pb.GetAddressRequest) (*pb.Address, error) {
	id, err := uuid.Parse(request.AddressId)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "Invalid ID format")
	}

	var address models.Address
	if err := DB.Where("address_id = ?", id).First(&address).Error; err != nil {
		return nil, status.Error(codes.NotFound, "Address not found")
	}

	return &pb.Address{
		AddressId:  address.AddressID.String(),
		CustomerId: address.CustomerID.String(),
		Name:       address.Name,
		Address:    address.Address,
		Note:       address.Note,
		HouseSize:  strconv.Itoa(address.HouseSize),
	}, nil
}

// GET all addresses for a customer
func (db *DBController) GetAddressesForCustomer(c *gin.Context) {
	customerIDStr := c.Param("customer_id")
	customerID, err := uuid.Parse(customerIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Customer ID format"})
		return
	}

	var addresses []models.Address
	if err := db.Database.Where("customer_id = ?", customerID).Find(&addresses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch addresses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": addresses})
}

// GET all addresses
func (db *DBController) GetAddresses(c *gin.Context) {
	var addresses []models.Address
	if err := db.Database.Find(&addresses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch addresses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": addresses})
}

// GET an address by ID
func (db *DBController) GetAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var address models.Address
	if err := db.Database.Where("address_id = ?", id).First(&address).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": address})
}

// POST - Create a new address for a customer
func (db *DBController) CreateAddress(c *gin.Context) {
	customerIDStr := c.Param("customer_id")
	customerID, err := uuid.Parse(customerIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Customer ID format"})
		return
	}

	var address models.Address
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address.CustomerID = customerID

	if err := db.Database.Create(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create address"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"results": address})
}

// PATCH - Update an existing address
func (db *DBController) UpdateAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var address models.Address
	if err := db.Database.Where("address_id = ?", id).First(&address).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Database.Save(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": address})
}

// DELETE - Delete an address
func (db *DBController) DeleteAddress(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var address models.Address
	if err := db.Database.Where("address_id = ?", id).First(&address).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	if err := db.Database.Delete(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": "Address deleted"})
}
