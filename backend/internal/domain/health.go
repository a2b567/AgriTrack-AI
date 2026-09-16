package domain

import (
	"time"

	"gorm.io/gorm"
)

type HealthRecord struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	AnimalID       uint           `json:"animal_id"`
	Animal         *Livestock     `gorm:"foreignKey:AnimalID" json:"animal,omitempty"`
	Diagnosis      string         `json:"diagnosis"`
	Symptoms       string         `json:"symptoms"`
	Treatment      string         `json:"treatment"`
	VeterinarianID *uint          `json:"veterinarian_id"`
	TreatmentDate  time.Time      `json:"treatment_date"`
	Notes          string         `json:"notes"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

type Vaccination struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	AnimalID       uint           `json:"animal_id"`
	Animal         *Livestock     `gorm:"foreignKey:AnimalID" json:"animal,omitempty"`
	VaccineName    string         `json:"vaccine_name"`
	VaccineType    string         `json:"vaccine_type"`
	Cost           float64        `json:"cost"`
	DateGiven      time.Time      `json:"date_given"`
	NextDueDate    *time.Time     `json:"next_due_date"`
	VeterinarianID *uint          `json:"veterinarian_id"`
	Notes          string         `json:"notes"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
