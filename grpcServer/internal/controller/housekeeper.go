package controller

import (
	context "context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"grpcServer/internal/model"
	"grpcServer/internal/service"
	"grpcServer/pb"
	"log"
	"net"
)

type ServiceServer struct {
	pb.UnimplementedHousekeeperServiceServer
}

func RegisterService(s *grpc.Server, l *net.Listener) {
	pb.RegisterHousekeeperServiceServer(s, &ServiceServer{})
	if err := s.Serve(*l); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func (s ServiceServer) CreateHousekeeper(ctx context.Context, request *pb.CreateHousekeeperRequest) (*pb.Housekeeper, error) {
	entity := model.Housekeeper{
		Firstname: request.Firstname,
		Lastname:  request.Lastname,
		Phone:     request.Phone,
	}
	err := service.CreateHousekeeper(&entity)
	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprint("Error - can't create: ", err))
	}
	return entity.ToGrpc(), nil
}

func (s ServiceServer) GetHousekeeper(ctx context.Context, request *pb.GetHousekeeperRequest) (*pb.Housekeeper, error) {
	entity, err := service.FindHousekeeper(int(request.Id))
	if err != nil {
		return nil, status.Error(codes.NotFound, fmt.Sprintf("Housekeeper id = %d isn't exist", request.Id))
	}
	return entity.ToGrpc(), nil
}

func (s ServiceServer) GetAllHousekeepers(ctx context.Context, request *pb.GetAllHousekeeperRequest) (*pb.HousekeeperList, error) {
	entities := service.FindAllHousekeeper()
	grpcType := make([]*pb.Housekeeper, len(*entities))
	for i := 0; i < len(grpcType); i++ {
		grpcType[i] = (*entities)[i].ToGrpc()
	}
	return &pb.HousekeeperList{Housekeepers: grpcType}, nil
}

func (s ServiceServer) UpdateHousekeeper(ctx context.Context, request *pb.UpdateHousekeeperRequest) (*pb.Housekeeper, error) {
	var reqEntity model.Housekeeper
	reqEntity.FromGRPC(*request.Housekeeper)
	entity, err := service.UpdateHousekeeper(reqEntity)
	fmt.Println(entity)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return entity.ToGrpc(), nil
}

func (s ServiceServer) DeleteHousekeeper(ctx context.Context, request *pb.DeleteHousekeeperRequest) (*pb.DeleteHousekeeperResponse, error) {
	err := service.DeleteHousekeeper(int(request.Id))
	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprint("Error deleting housekeeper: ", err))
	}
	return &pb.DeleteHousekeeperResponse{}, nil
}
