package controllers

import (
	"grpcServer/models"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type RegistrationData struct {
	Name     string `json:"name" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginData struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register a new user with hashed password and JWT token
func (db *DBController) Register(c *gin.Context) {
	var registrationData RegistrationData
	if err := c.ShouldBindJSON(&registrationData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid registration data"})
		return
	}

	// Hash the password securely
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registrationData.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash the password"})
		return
	}

	newCustomer := models.Customer{
		Name:     registrationData.Name,
		Phone:    registrationData.Phone,
		Email:    registrationData.Email,
		Password: string(hashedPassword),
	}

	// Save the user to the database
	if err := db.Database.Create(&newCustomer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	token := generateToken(newCustomer)

	c.JSON(http.StatusCreated, gin.H{"message": "Registration successful", "access_token": token})
}

// Log in a user and generate a JWT
func (db *DBController) Login(c *gin.Context) {
	var loginData LoginData
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid login data"})
		return
	}

	var customer models.Customer
	if err := db.Database.Where("email = ?", loginData.Email).First(&customer).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Check the hashed password against the provided password
	err := bcrypt.CompareHashAndPassword([]byte(customer.Password), []byte(loginData.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate a JWT token
	token := generateToken(customer)

	c.JSON(http.StatusOK, gin.H{"access_token": token})
}

func generateToken(customer models.Customer) string {
	secret := os.Getenv("JWT_SECRET")
	// Define the claims
	claims := jwt.MapClaims{
		"uuid":  customer.CustomerID,
		"email": customer.Email,
		"role":  "customer",
		"exp":   time.Now().Add(time.Hour * 2).Unix(),
		"iat":   time.Now().Unix(),
	}

	// Create the token with the claims and sign it
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		panic("Failed to generate token")
	}

	return tokenString
}
