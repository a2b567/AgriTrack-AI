package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type WeightService struct {
	repo *repository.WeightRepository
}

func NewWeightService(repo *repository.WeightRepository) *WeightService {
	return &WeightService{repo: repo}
}

func (s *WeightService) CreateRecord(w *domain.WeightRecord) error {
	return s.repo.Create(w)
}

func (s *WeightService) GetRecordsByAnimalID(animalID uint) ([]domain.WeightRecord, error) {
	return s.repo.GetByAnimalID(animalID)
}
