package response

type ErrorResponse struct {
	Success bool   `json:"success"`
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func NewLoginError() *ErrorResponse {
	return &ErrorResponse{
		Success: false,
		Status:  403,
		Message: "Invalid email or password",
	}
}

func NewBadRequest() *ErrorResponse {
	return &ErrorResponse{
		Success: false,
		Status:  400,
		Message: "Bad request",
	}
}