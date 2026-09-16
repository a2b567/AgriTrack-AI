package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type LivestockRepository interface {
	Create(livestock *domain.Livestock) error
	FindAll() ([]domain.Livestock, error)
	FindByID(id uint) (*domain.Livestock, error)
	FindByRFID(rfid string) (*domain.Livestock, error)
	Update(livestock *domain.Livestock) error
	Delete(id uint) error
}

type livestockRepository struct {
	db *gorm.DB
}

func NewLivestockRepository(db *gorm.DB) LivestockRepository {
	return &livestockRepository{db}
}

func (r *livestockRepository) Create(livestock *domain.Livestock) error {
	return r.db.Create(livestock).Error
}

func (r *livestockRepository) FindAll() ([]domain.Livestock, error) {
	var livestock []domain.Livestock
	err := r.db.Find(&livestock).Error
	return livestock, err
}

func (r *livestockRepository) FindByID(id uint) (*domain.Livestock, error) {
	var livestock domain.Livestock
	err := r.db.First(&livestock, id).Error
	if err != nil {
		return nil, err
	}
	return &livestock, nil
}

func (r *livestockRepository) FindByRFID(rfid string) (*domain.Livestock, error) {
	var livestock domain.Livestock
	err := r.db.Where("rfid_number = ? OR animal_code = ?", rfid, rfid).First(&livestock).Error
	if err != nil {
		return nil, err
	}
	return &livestock, nil
}

func (r *livestockRepository) Update(livestock *domain.Livestock) error {
	return r.db.Save(livestock).Error
}

func (r *livestockRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Livestock{}, id).Error
}
