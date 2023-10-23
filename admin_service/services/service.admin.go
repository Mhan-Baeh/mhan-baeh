package service

import (
	model "admin_service/models"
	repository "admin_service/repositories"
	request "admin_service/schemas/requests"
	response "admin_service/schemas/responses"
	os "os"
	s "strconv"
	time "time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AdminService interface {
	CreateAdmin(req *request.CreateAdminRequest) (err error)
	LoginAdmin(req *request.LoginAdminRequest) (loginResponse *response.LoginAdminData, err error)
}

type adminService struct {
	adminRepository repository.AdminRepository
}

func NewAdminService(adminRepository repository.AdminRepository) AdminService {
	return &adminService{
		adminRepository: adminRepository,
	}
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func ComparePassword(hashedPassword, userInput string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(userInput))
}

func GenerateLoginToken(customClaims map[string]interface{}, isExpire bool) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["iat"] = time.Now().Unix()
	if isExpire {
		exp, _ := s.Atoi(os.Getenv("JWT_EXPIRES_MINUTES"))
		claims["exp"] = time.Now().Add(time.Duration(exp) * time.Minute).Unix()
	}
	for k, v := range customClaims {
		claims[k] = v
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func (adminService *adminService) CreateAdmin(req *request.CreateAdminRequest) (err error) {
	var admin model.Admin
	admin.Admin_uuid = uuid.New()
	admin.Email = req.Email
	admin.Password, err = HashPassword(req.Password)
	if err != nil {
		return err
	}
	admin.Name = req.Name
	err = adminService.adminRepository.CreateAdmin(&admin)
	if err != nil {
		return err
	}
	return nil
}

func (adminService *adminService) LoginAdmin(req *request.LoginAdminRequest) (loginResponse *response.LoginAdminData, err error) {
	admin, err := adminService.adminRepository.GetAdminByEmail(req.Email)
	if err != nil || admin == nil {
		return nil, err
	}

	err = ComparePassword(admin.Password, req.Password)

	if err != nil {
		return nil, err
	}

	claims := map[string]interface{}{}
	claims["admin_uuid"] = admin.Admin_uuid.String()
	claims["email"] = admin.Email
	claims["role"] = "admin"
	token, err := GenerateLoginToken(claims, true)
	if err != nil {
		return nil, err
	}

	var res response.LoginAdminData
	res.Admin_uuid = admin.Admin_uuid.String()
	res.Email = admin.Email
	res.Name = admin.Name
	res.Token = token
	return &res, nil
}
