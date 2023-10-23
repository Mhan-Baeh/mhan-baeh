package response

type LoginAdminResponse struct {
	Success bool `json:"success"`
	Status int `json:"status"`
	Data *LoginAdminData `json:"data"`
}

type LoginAdminData struct {
	Admin_uuid string `json:"admin_uuid"`
	Email string `json:"email"`
	Name string `json:"name"`
	Token string `json:"token"`
}