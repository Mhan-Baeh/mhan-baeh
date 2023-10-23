package grpc

import (
	"context"
	pb "housekeeper_service/pb"

	"github.com/jinzhu/gorm"
)

type HousekeeperServiceServer struct {
	pb.UnimplementedHousekeeperServiceServer
	DB *gorm.DB
}

func NewHousekeeperServiceServer(db *gorm.DB) *HousekeeperServiceServer {
	return &HousekeeperServiceServer{DB: db}
}

func (h HousekeeperServiceServer) GetHousekeeperByUuid(ctx context.Context, request *pb.GetHousekeeperRequest) (housekeeper *pb.Housekeeper, err error) {
	housekeeper = &pb.Housekeeper{}
	err = h.DB.Where("housekeeper_uuid = ?", request.HousekeeperUuid).First(housekeeper).Error
	if err != nil {
		return nil, err
	}
	return housekeeper, nil
}

func (h HousekeeperServiceServer) GetAllHousekeepers(ctx context.Context, request *pb.Empty) (housekeeperList *pb.HousekeeperList, err error) {
	housekeeperList = &pb.HousekeeperList{}
	// find all housekeepers from database
	err = h.DB.Find(&housekeeperList.Housekeepers).Error
	if err != nil {
		return nil, err
	}
	return housekeeperList, nil
}
