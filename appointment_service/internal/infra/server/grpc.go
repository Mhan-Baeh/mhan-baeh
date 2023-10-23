package server

import (
	"appointment_service/internal/handlers/grpc"
	grpcServer "google.golang.org/grpc"
	"net"
	log "github.com/sirupsen/logrus"
)

type GRPCServer struct {
	handler *grpc.Handler
	port  string
}

func NewGRPCServer(handler *grpc.Handler, port string) *GRPCServer {
	return &GRPCServer{handler: handler, port: port}
}

func (s *GRPCServer) Run() {
	lis, err := net.Listen("tcp", ":"+s.port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServerInstance := grpcServer.NewServer()
	// Register your services here
	grpcServerInstance.Serve(lis)
}
