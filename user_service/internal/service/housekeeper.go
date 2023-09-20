package service

import (
	"fmt"
	"grpcServer/internal/model"
)

// id should be removed
func CreateHousekeeper(entity *model.Housekeeper) error {
	tx := model.DB.Create(entity)
	fmt.Println("created:", tx)
	return nil
}

func FindHousekeeper(id int) (*model.Housekeeper, error) {
	var entity model.Housekeeper
	if err := model.DB.Where("id = ?", id).First(&entity).Error; err != nil {
		fmt.Println("Error - Housekeeper not exist: ", err)
		return nil, err
	}
	return &entity, nil
}

func FindAllHousekeeper() *[]model.Housekeeper {
	var entities []model.Housekeeper
	model.DB.Find(&entities)
	return &entities
}

func UpdateHousekeeper(entity model.Housekeeper) (*model.Housekeeper, error) {
	id := entity.Id

	var curEntity model.Housekeeper

	if err := model.DB.Where("id = ?", id).First(&curEntity).Error; err != nil {
		fmt.Println("Error - id not exist ", err)
		return nil, err
	}

	curEntity.Firstname = entity.Firstname
	curEntity.Lastname = entity.Lastname
	curEntity.Phone = entity.Phone

	if err := model.DB.Model(&curEntity).Updates(&curEntity).Error; err != nil {
		fmt.Println("Error - can't update: ", err)
		return nil, err
	}
	return &curEntity, nil
}

func DeleteHousekeeper(id int) error {
	var entity model.Housekeeper
	if err := model.DB.Where("id = ?", id).First(&entity).Error; err != nil {
		fmt.Println("Error - Housekeeper not found: ", err)
		return err
	}

	if err := model.DB.Delete(&entity).Error; err != nil {
		fmt.Println("Error - Can't delete housekeeper: ", err)
		return err
	}
	return nil
}
