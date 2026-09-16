package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type BreedingService struct {
	repo *repository.BreedingRepository
}

func NewBreedingService(repo *repository.BreedingRepository) *BreedingService {
	return &BreedingService{repo: repo}
}

func (s *BreedingService) CreateRecord(b *domain.BreedingRecord) error {
	return s.repo.Create(b)
}

func (s *BreedingService) GetAllRecords() ([]domain.BreedingRecord, error) {
	return s.repo.GetAll()
}
