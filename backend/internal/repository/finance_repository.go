package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type FinanceRepository struct {
	db *gorm.DB
}

func NewFinanceRepository(db *gorm.DB) *FinanceRepository {
	return &FinanceRepository{db: db}
}

func (r *FinanceRepository) Create(f *domain.Finance) error {
	return r.db.Create(f).Error
}

func (r *FinanceRepository) GetAll() ([]domain.Finance, error) {
	var records []domain.Finance
	err := r.db.Order("date desc").Find(&records).Error
	return records, err
}
