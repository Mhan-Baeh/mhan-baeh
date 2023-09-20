package main

import (
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"grpcServer/internal/controller"
	"grpcServer/internal/model"
	"net"
)

func main() {
	fmt.Println("Up")
	model.ConnectDatabase()
	listener, err := net.Listen("tcp", ":18080")
	if err != nil {
		panic(err)
	}

	s := grpc.NewServer()
	reflection.Register(s)
	controller.RegisterService(s, &listener)
}
