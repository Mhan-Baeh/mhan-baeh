package model

import "grpcServer/pb"

type Housekeeper struct {
	Id        uint   `json:"id, omitempty" gorm:"primary""`
	Firstname string `json:"firstname,omitempty"`
	Lastname  string `json:"lastname,omitempty"`
	Phone     string `json:"phone,omitempty"`
}

func (h *Housekeeper) ToGrpc() *pb.Housekeeper {
	return &pb.Housekeeper{
		Id:        int32(h.Id),
		Firstname: h.Firstname,
		Lastname:  h.Lastname,
		Phone:     h.Phone,
	}
}

func (h *Housekeeper) FromGRPC(housekeeper pb.Housekeeper) {
	h.Id = uint(housekeeper.Id)
	h.Firstname = housekeeper.Firstname
	h.Lastname = housekeeper.Lastname
	h.Phone = housekeeper.Phone
}
