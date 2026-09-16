package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type NotificationService struct {
	repo *repository.NotificationRepository
}

func NewNotificationService(repo *repository.NotificationRepository) *NotificationService {
	return &NotificationService{repo: repo}
}

func (s *NotificationService) CreateNotification(title, message string) error {
	n := &domain.Notification{
		Title:   title,
		Message: message,
		IsRead:  false,
	}
	return s.repo.Create(n)
}

func (s *NotificationService) GetUnreadNotifications() ([]domain.Notification, error) {
	return s.repo.GetAllUnread()
}

func (s *NotificationService) MarkAsRead(id uint) error {
	return s.repo.MarkAsRead(id)
}
