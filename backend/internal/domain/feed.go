package domain

import (
	"time"

	"gorm.io/gorm"
)

type FeedRecord struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	FeedType     string         `json:"feed_type"`
	Quantity     float64        `json:"quantity"` // in kg or lbs
	Supplier     string         `json:"supplier"`
	Cost           float64        `json:"cost"`
	EstimatedDays  int            `json:"estimated_days"`
	DateRecorded   time.Time      `json:"date_recorded"`
	Notes          string         `json:"notes"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
