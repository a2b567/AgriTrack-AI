package domain

import (
	"time"

	"gorm.io/gorm"
)

type BreedingRecord struct {
	ID                uint           `gorm:"primaryKey" json:"id"`
	FemaleAnimalID    uint           `json:"female_animal_id"`
	MaleAnimalID      *uint          `json:"male_animal_id"` // Can be null if artificial insemination
	Female            *Livestock     `gorm:"foreignKey:FemaleAnimalID" json:"female,omitempty"`
	Male              *Livestock     `gorm:"foreignKey:MaleAnimalID" json:"male,omitempty"`
	BreedingDate      time.Time      `json:"breeding_date"`
	PregnancyStatus   string         `json:"pregnancy_status"` // Pending, Confirmed, Failed
	ExpectedBirthDate *time.Time     `json:"expected_birth_date"`
	ActualBirthDate   *time.Time     `json:"actual_birth_date"`
	Notes             string         `json:"notes"`
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
	DeletedAt         gorm.DeletedAt `gorm:"index" json:"-"`
}
