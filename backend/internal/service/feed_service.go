package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type FeedService struct {
	repo        *repository.FeedRepository
	financeRepo *repository.FinanceRepository
}

func NewFeedService(repo *repository.FeedRepository, financeRepo *repository.FinanceRepository) *FeedService {
	return &FeedService{repo: repo, financeRepo: financeRepo}
}

func (s *FeedService) CreateRecord(f *domain.FeedRecord) error {
	err := s.repo.Create(f)
	if err != nil {
		return err
	}

	financeRecord := &domain.Finance{
		Type:        "Expense",
		Category:    "Feed",
		Amount:      f.Cost,
		Description: f.FeedType + " feed",
		Date:        f.DateRecorded,
	}
	return s.financeRepo.Create(financeRecord)
}

func (s *FeedService) GetAllRecords() ([]domain.FeedRecord, error) {
	return s.repo.GetAll()
}
