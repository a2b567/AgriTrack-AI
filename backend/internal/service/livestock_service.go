package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type LivestockService interface {
	CreateLivestock(livestock *domain.Livestock) error
	GetAllLivestock() ([]domain.Livestock, error)
	GetLivestockByID(id uint) (*domain.Livestock, error)
	GetLivestockByRFID(rfid string) (*domain.Livestock, error)
	UpdateLivestock(livestock *domain.Livestock) error
	DeleteLivestock(id uint) error
}

type livestockService struct {
	repo repository.LivestockRepository
}

func NewLivestockService(repo repository.LivestockRepository) LivestockService {
	return &livestockService{repo}
}

func (s *livestockService) CreateLivestock(livestock *domain.Livestock) error {
	return s.repo.Create(livestock)
}

func (s *livestockService) GetAllLivestock() ([]domain.Livestock, error) {
	return s.repo.FindAll()
}

func (s *livestockService) GetLivestockByID(id uint) (*domain.Livestock, error) {
	return s.repo.FindByID(id)
}

func (s *livestockService) GetLivestockByRFID(rfid string) (*domain.Livestock, error) {
	return s.repo.FindByRFID(rfid)
}

func (s *livestockService) UpdateLivestock(livestock *domain.Livestock) error {
	return s.repo.Update(livestock)
}

func (s *livestockService) DeleteLivestock(id uint) error {
	return s.repo.Delete(id)
}
