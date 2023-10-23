package response

type HousekeeperResponse struct {
	Success bool        `json:"success"`
	Status  int         `json:"status"`
	Data    interface{} `json:"data"`
}

type LoginHousekeeperData struct {
	Housekeeper_uuid string `json:"housekeeper_uuid"`
	Email            string `json:"email"`
	Name             string `json:"name"`
	Phone            string `json:"phone"`
	Token            string `json:"token"`
}

type HousekeeperData struct {
	Housekeeper_uuid string `json:"housekeeper_uuid"`
	Email            string `json:"email"`
	Password         string `json:"password"`
	Name             string `json:"name"`
	Phone            string `json:"phone"`
}
