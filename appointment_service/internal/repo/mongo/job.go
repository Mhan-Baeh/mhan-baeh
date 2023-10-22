package mongo

import (
	MongoModel "appointment_service/internal/models/mongo"
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type JobRepo struct {
	collection *mongo.Collection
	dbName    string
}

func NewJobRepo(client *mongo.Client, dbName string) *JobRepo {
	collection := client.Database(dbName).Collection("jobs")
	return &JobRepo{collection: collection, dbName: dbName}
}

func (r *JobRepo) CreateJob(ctx context.Context, job *MongoModel.Job) error {
	_, err := r.collection.InsertOne(ctx, job)
	return err
}

func (r *JobRepo) GetAllJob(ctx context.Context) ([]*MongoModel.Job, error) {
	var jobs []*MongoModel.Job
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	err = cursor.All(ctx, &jobs)
	if err != nil {
		return nil, err
	}

	return jobs, nil
}