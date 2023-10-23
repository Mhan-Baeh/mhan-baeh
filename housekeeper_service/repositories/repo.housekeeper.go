package repository

import (
	model "housekeeper_service/models"

	"github.com/jinzhu/gorm"
)

type HousekeeperRepository interface {
	CreateHousekeeper(housekeeper *model.Housekeeper) (err error)
	GetHousekeeperByEmail(email string) (housekeeper *model.Housekeeper, err error)
	GetHousekeeperByUuid(uuid string) (housekeeper *model.Housekeeper, err error)
	GetAllHousekeeper() (housekeeper *[]model.Housekeeper, err error)
}

type housekeeperRepository struct {
	db *gorm.DB
}

func NewHousekeeperRepository(db *gorm.DB) HousekeeperRepository {
	return &housekeeperRepository{
		db: db,
	}
}

func (housekeeperRepository *housekeeperRepository) CreateHousekeeper(housekeeper *model.Housekeeper) (err error) {
	err = housekeeperRepository.db.Create(housekeeper).Error
	if err != nil {
		return err
	}
	return
}

func (housekeeperRepository *housekeeperRepository) GetHousekeeperByEmail(email string) (housekeeper *model.Housekeeper, err error) {
	housekeeper = &model.Housekeeper{}
	err = housekeeperRepository.db.Where("email = ?", email).First(housekeeper).Error
	if err != nil {
		return nil, err
	}
	return housekeeper, nil
}

func (housekeeperRepository *housekeeperRepository) GetHousekeeperByUuid(uuid string) (housekeeper *model.Housekeeper, err error) {
	housekeeper = &model.Housekeeper{}
	err = housekeeperRepository.db.Where("housekeeper_uuid = ?", uuid).First(housekeeper).Error
	if err != nil {
		return nil, err
	}
	return housekeeper, nil
}

func (housekeeperRepository *housekeeperRepository) GetAllHousekeeper() (housekeeper *[]model.Housekeeper, err error) {
	housekeeper = &[]model.Housekeeper{}
	err = housekeeperRepository.db.Find(housekeeper).Error
	if err != nil {
		return nil, err
	}
	return housekeeper, nil
}
