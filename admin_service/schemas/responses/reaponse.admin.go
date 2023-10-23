package response

type LoginAdminResponse struct {
	Admin_uuid string `json:"admin_uuid"`
	Email string `json:"email"`
	Name string `json:"name"`
	Token string `json:"token"`
}