package request

type CreateAdminRequest struct {
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Name string `json:"name" binding:"required"`
}

type LoginAdminRequest struct {
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}