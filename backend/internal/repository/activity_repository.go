package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type ActivityRepository struct {
	db *gorm.DB
}

func NewActivityRepository(db *gorm.DB) *ActivityRepository {
	return &ActivityRepository{db: db}
}

func (r *ActivityRepository) Create(a *domain.RFIDActivity) error {
	return r.db.Create(a).Error
}

func (r *ActivityRepository) GetByAnimalID(animalID uint) ([]domain.RFIDActivity, error) {
	var activities []domain.RFIDActivity
	err := r.db.Where("animal_id = ?", animalID).Order("timestamp desc").Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) GetAll() ([]domain.RFIDActivity, error) {
	var activities []domain.RFIDActivity
	err := r.db.Order("timestamp desc").Find(&activities).Error
	return activities, err
}
