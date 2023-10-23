package grpc

import (
	"context"
	pb "housekeeper_service/pb"

	"github.com/jinzhu/gorm"
)

type HousekeeperServiceServer struct {
	pb.UnimplementedHousekeeperServiceServer
}

var DB *gorm.DB

func NewHousekeeperServiceServer(db *gorm.DB) *HousekeeperServiceServer {
	DB = db
	return &HousekeeperServiceServer{}
}

func (housekeeperServiceServer HousekeeperServiceServer) GetHousekeeperByUuid(ctx context.Context, request *pb.GetHousekeeperRequest) (housekeeper *pb.Housekeeper, err error) {
	housekeeper = &pb.Housekeeper{}
	err = DB.Where("housekeeper_uuid = ?", request.HousekeeperUuid).First(housekeeper).Error
	if err != nil {
		return nil, err
	}
	return housekeeper, nil
}

func (housekeeperServiceServer HousekeeperServiceServer) GetAllHousekeepers(ctx context.Context, request *pb.Empty) (housekeeperList *pb.HousekeeperList, err error) {
	housekeeperList = &pb.HousekeeperList{}
	err = DB.Find(housekeeperList).Error
	if err != nil {
		return nil, err
	}
	return housekeeperList, nil
}
