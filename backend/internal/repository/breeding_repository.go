package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type BreedingRepository struct {
	db *gorm.DB
}

func NewBreedingRepository(db *gorm.DB) *BreedingRepository {
	return &BreedingRepository{db: db}
}

func (r *BreedingRepository) Create(b *domain.BreedingRecord) error {
	return r.db.Create(b).Error
}

func (r *BreedingRepository) GetAll() ([]domain.BreedingRecord, error) {
	var records []domain.BreedingRecord
	err := r.db.Preload("Female").Find(&records).Error
	return records, err
}
