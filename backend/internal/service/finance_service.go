package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type FinanceService struct {
	repo *repository.FinanceRepository
}

func NewFinanceService(repo *repository.FinanceRepository) *FinanceService {
	return &FinanceService{repo: repo}
}

func (s *FinanceService) CreateRecord(f *domain.Finance) error {
	return s.repo.Create(f)
}

func (s *FinanceService) GetAllRecords() ([]domain.Finance, error) {
	return s.repo.GetAll()
}
