package controllers

import (
	"context"
	"grpcServer/models"

	"net/http"

	"grpcServer/pb"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type CustomerServiceServer struct {
	pb.UnimplementedCustomerServiceServer
}


func (s CustomerServiceServer) GetCustomer(ctx context.Context, request *pb.GetCustomerRequest) (*pb.Customer, error) {
	id, err := uuid.Parse(request.CustomerId)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "Invalid ID format")
	}

	var customer models.Customer
	if err := DB.Where("customer_id = ?", id).First(&customer).Error; err != nil {
		return nil, status.Error(codes.NotFound, "Customer not found")
	}

	return &pb.Customer{
		CustomerId: customer.CustomerID.String(),
		Name:       customer.Name,
		Phone:      customer.Phone,
		Email:      customer.Email,
	}, nil

}

// GET
func (db *DBController) GetCustomers(c *gin.Context) {
	var customers []models.Customer
	if err := db.Database.Find(&customers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch customers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": customers})
}

// GET BY ID
func (db *DBController) GetCustomer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var customer models.Customer
	if err := db.Database.Where("customer_id = ?", id).First(&customer).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": customer})
}

// POST
func (db *DBController) CreateCustomer(c *gin.Context) {
	var customer models.Customer
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Database.Create(&customer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create customer"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"results": customer})
}

// PATCH
func (db *DBController) UpdateCustomer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var existingCustomer models.Customer
	if err := db.Database.Where("customer_id = ?", id).First(&existingCustomer).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}
	currentPassword := existingCustomer.Password

	// Bind the request JSON to the existing customer
	if err := c.ShouldBindJSON(&existingCustomer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if existingCustomer.Password == "" {
		existingCustomer.Password = currentPassword
	}

	// hash the password if password and not hashed
	if len(existingCustomer.Password) <= 16 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(existingCustomer.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash the password"})
			return
		}
		existingCustomer.Password = string(hashedPassword)
	}
	
	
	// Update the customer in the database
	if err := db.Database.Save(&existingCustomer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update customer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": existingCustomer})
}

// DELETE
func (db *DBController) DeleteCustomer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var customer models.Customer
	if err := db.Database.Where("customer_id = ?", id).First(&customer).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	if err := db.Database.Delete(&customer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete customer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"results": "Customer deleted"})
}
