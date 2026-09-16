package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type NotificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) Create(n *domain.Notification) error {
	return r.db.Create(n).Error
}

func (r *NotificationRepository) GetAllUnread() ([]domain.Notification, error) {
	var notifications []domain.Notification
	err := r.db.Where("is_read = ?", false).Order("created_at desc").Find(&notifications).Error
	return notifications, err
}

func (r *NotificationRepository) MarkAsRead(id uint) error {
	return r.db.Model(&domain.Notification{}).Where("id = ?", id).Update("is_read", true).Error
}
