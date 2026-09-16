package domain

import (
	"time"
)

type WeightRecord struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	AnimalID  uint      `json:"animal_id"`
	WeightKg  float64   `json:"weight_kg"`
	Date      time.Time `json:"date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
