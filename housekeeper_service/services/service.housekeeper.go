package service

import (
	"errors"
	model "housekeeper_service/models"
	repository "housekeeper_service/repositories"
	request "housekeeper_service/schemas/requests"
	response "housekeeper_service/schemas/responses"
	os "os"
	s "strconv"
	time "time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

type HousekeeperService interface {
	CreateHousekeeper(req *request.CreateHousekeeperRequest) (housekeeperData *response.HousekeeperData, err error)
	LoginHousekeeper(req *request.LoginHousekeeperRequest) (loginResponse *response.LoginHousekeeperData, err error)
	GetHousekeeperByUuid(uuid string) (housekeeperData *response.HousekeeperData, err error)
	GetAllHousekeeper() (housekeeperData *[]response.HousekeeperData, err error)
}

type housekeeperService struct {
	housekeeperRepository repository.HousekeeperRepository
}

func NewHousekeeperService(housekeeperRepository repository.HousekeeperRepository) HousekeeperService {
	return &housekeeperService{
		housekeeperRepository: housekeeperRepository,
	}
}

func ComparePassword(truePassword, inputPassword string) bool {
	return truePassword == inputPassword
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

func (housekeeperService *housekeeperService) CreateHousekeeper(req *request.CreateHousekeeperRequest) (housekeeperData *response.HousekeeperData, err error) {
	var housekeeper model.Housekeeper
	housekeeper.Housekeeper_uuid = uuid.New()
	housekeeper.Email = req.Email
	housekeeper.Password = req.Password
	housekeeper.Name = req.Name
	housekeeper.Phone = req.Phone
	err = housekeeperService.housekeeperRepository.CreateHousekeeper(&housekeeper)
	if err != nil {
		return nil, err
	}
	housekeeperData = &response.HousekeeperData{
		Housekeeper_uuid: housekeeper.Housekeeper_uuid.String(),
		Email:            housekeeper.Email,
		Password:         housekeeper.Password,
		Name:             housekeeper.Name,
		Phone:            housekeeper.Phone,
	}
	return housekeeperData, nil
}

func (housekeeperService *housekeeperService) LoginHousekeeper(req *request.LoginHousekeeperRequest) (loginResponse *response.LoginHousekeeperData, err error) {
	housekeeper, err := housekeeperService.housekeeperRepository.GetHousekeeperByEmail(req.Email)
	if err != nil || housekeeper == nil {
		return nil, err
	}

	passwordCheck := ComparePassword(housekeeper.Password, req.Password)

	if !passwordCheck {
		return nil, errors.New("wrong password")
	}

	claims := map[string]interface{}{}
	claims["housekeeper_uuid"] = housekeeper.Housekeeper_uuid.String()
	claims["email"] = housekeeper.Email
	claims["role"] = "housekeeper"
	token, err := GenerateLoginToken(claims, true)
	if err != nil {
		return nil, err
	}

	var res response.LoginHousekeeperData
	res.Housekeeper_uuid = housekeeper.Housekeeper_uuid.String()
	res.Email = housekeeper.Email
	res.Name = housekeeper.Name
	res.Phone = housekeeper.Phone
	res.Token = token
	return &res, nil
}

func (housekeeperService *housekeeperService) GetHousekeeperByUuid(uuid string) (housekeeperData *response.HousekeeperData, err error) {
	housekeeper, err := housekeeperService.housekeeperRepository.GetHousekeeperByUuid(uuid)
	if err != nil || housekeeper == nil {
		return nil, err
	}
	housekeeperData = &response.HousekeeperData{
		Housekeeper_uuid: housekeeper.Housekeeper_uuid.String(),
		Email:            housekeeper.Email,
		Password:         housekeeper.Password,
		Name:             housekeeper.Name,
		Phone:            housekeeper.Phone,
	}
	return housekeeperData, nil
}

func (housekeeperService *housekeeperService) GetAllHousekeeper() (housekeeperData *[]response.HousekeeperData, err error) {
	housekeeper, err := housekeeperService.housekeeperRepository.GetAllHousekeeper()
	if err != nil || housekeeper == nil {
		return nil, err
	}
	var housekeeperDataList []response.HousekeeperData
	for _, housekeeper := range *housekeeper {
		housekeeperData := response.HousekeeperData{
			Housekeeper_uuid: housekeeper.Housekeeper_uuid.String(),
			Email:            housekeeper.Email,
			Password:         housekeeper.Password,
			Name:             housekeeper.Name,
			Phone:            housekeeper.Phone,
		}
		housekeeperDataList = append(housekeeperDataList, housekeeperData)
	}
	return &housekeeperDataList, nil
}
