package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type VaccinationRepository struct {
	db *gorm.DB
}

func NewVaccinationRepository(db *gorm.DB) *VaccinationRepository {
	return &VaccinationRepository{db: db}
}

func (r *VaccinationRepository) Create(v *domain.Vaccination) error {
	return r.db.Create(v).Error
}

func (r *VaccinationRepository) GetAll() ([]domain.Vaccination, error) {
	var vaccinations []domain.Vaccination
	err := r.db.Preload("Animal").Find(&vaccinations).Error
	return vaccinations, err
}
