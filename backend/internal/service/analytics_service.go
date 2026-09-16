package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type AnalyticsService struct {
	repo *repository.AnalyticsRepository
}

func NewAnalyticsService(repo *repository.AnalyticsRepository) *AnalyticsService {
	return &AnalyticsService{repo: repo}
}

func (s *AnalyticsService) GetDashboardStats() (*domain.DashboardStats, error) {
	return s.repo.GetDashboardStats()
}
