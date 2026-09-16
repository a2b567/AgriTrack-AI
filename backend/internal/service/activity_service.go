package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type ActivityService struct {
	repo *repository.ActivityRepository
}

func NewActivityService(repo *repository.ActivityRepository) *ActivityService {
	return &ActivityService{repo: repo}
}

func (s *ActivityService) LogActivity(a *domain.RFIDActivity) error {
	return s.repo.Create(a)
}

func (s *ActivityService) GetActivitiesByAnimalID(animalID uint) ([]domain.RFIDActivity, error) {
	return s.repo.GetByAnimalID(animalID)
}

func (s *ActivityService) GetAllActivities() ([]domain.RFIDActivity, error) {
	return s.repo.GetAll()
}
