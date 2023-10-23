package mongo

import "go.mongodb.org/mongo-driver/bson/primitive"

type Job struct {
	JobId   primitive.ObjectID `bson:"_id,omitempty"`
	JobName string             `bson:"job_name" json:"job_name" binding:"required"`
	JobRate int                `bson:"job_rate" json:"job_rate" binding:"required"`
}
