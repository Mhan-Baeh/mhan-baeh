package controllers

import "gorm.io/gorm"

var DB *gorm.DB

// create database controller
type DBController struct {
	Database *gorm.DB
}
