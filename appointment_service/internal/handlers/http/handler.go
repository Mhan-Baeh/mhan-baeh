package http

type Handler struct {
	AppointmentHandler *AppointmentHandler
	JobHandler         *JobHandler
}

func NewHandler(
	AppointmentHandler *AppointmentHandler,
	JobHandler *JobHandler) *Handler {
	return &Handler{AppointmentHandler: AppointmentHandler, JobHandler: JobHandler}
}


