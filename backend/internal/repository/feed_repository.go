package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type FeedRepository struct {
	db *gorm.DB
}

func NewFeedRepository(db *gorm.DB) *FeedRepository {
	return &FeedRepository{db: db}
}

func (r *FeedRepository) Create(f *domain.FeedRecord) error {
	return r.db.Create(f).Error
}

func (r *FeedRepository) GetAll() ([]domain.FeedRecord, error) {
	var records []domain.FeedRecord
	err := r.db.Find(&records).Error
	return records, err
}
