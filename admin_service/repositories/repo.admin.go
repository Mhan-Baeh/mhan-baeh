package repository

import (
	"github.com/jinzhu/gorm"
	model "admin_service/models"
)

type AdminRepository interface {
	CreateAdmin(admin *model.Admin) (err error)
	GetAdminByEmail(email string) (admin *model.Admin, err error)
}

type adminRepository struct{
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) AdminRepository {
	return &adminRepository{
		db: db,
	}
}

func (adminRepository *adminRepository) CreateAdmin(admin *model.Admin) (err error) {
	err = adminRepository.db.Create(admin).Error
	if err != nil {
		return err
	}
	return
}

func (adminRepository *adminRepository) GetAdminByEmail(email string) (admin *model.Admin, err error) {
	admin = &model.Admin{}
	err = adminRepository.db.Where("email = ?", email).First(admin).Error
	if err != nil {
		return nil, err
	}
	return admin, nil
}
