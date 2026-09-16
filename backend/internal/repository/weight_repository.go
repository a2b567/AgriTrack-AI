package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type WeightRepository struct {
	db *gorm.DB
}

func NewWeightRepository(db *gorm.DB) *WeightRepository {
	return &WeightRepository{db: db}
}

func (r *WeightRepository) Create(w *domain.WeightRecord) error {
	return r.db.Create(w).Error
}

func (r *WeightRepository) GetByAnimalID(animalID uint) ([]domain.WeightRecord, error) {
	var records []domain.WeightRecord
	err := r.db.Where("animal_id = ?", animalID).Order("date asc").Find(&records).Error
	return records, err
}
