package client

import (
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type GRPCClient struct {
	host string
}

func NewGRPCClient(host string) *GRPCClient {
	return &GRPCClient{host: host}
}

func (s *GRPCClient) InitClient() (*grpc.ClientConn, error) {
	creds := insecure.NewCredentials()
	conn, err := grpc.Dial(s.host, grpc.WithTransportCredentials(creds))
	if err != nil {
		log.Errorf("failed to dial: %v", err)
		return nil, err
	}
	return conn, nil
}
