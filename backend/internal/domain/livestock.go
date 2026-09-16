package domain

import (
	"time"

	"gorm.io/gorm"
)

type Livestock struct {
	ID                uint           `gorm:"primaryKey" json:"id"`
	AnimalCode        string         `gorm:"uniqueIndex;not null" json:"animal_code"`
	RFIDNumber        string         `gorm:"uniqueIndex" json:"rfid_number"`
	BarcodeNumber     string         `gorm:"uniqueIndex" json:"barcode_number"`
	AnimalName        string         `json:"animal_name"`
	Species           string         `json:"species"`
	Breed             string         `json:"breed"`
	Gender            string         `json:"gender"`
	BirthDate         time.Time      `json:"birth_date"`
	Weight            float64        `json:"weight"`
	Color             string         `json:"color"`
	HealthStatus      string         `json:"health_status"` // Healthy, Sick, Under Treatment
	BreedingStatus    string         `json:"breeding_status"`
	VaccinationStatus string         `json:"vaccination_status"`
	ParentInformation string         `json:"parent_information"`
	RegistrationDate  time.Time      `json:"registration_date"`
	Notes             string         `json:"notes"`
	ImageURL          string         `json:"image_url"`
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
	DeletedAt         gorm.DeletedAt `gorm:"index" json:"-"`
}

type RFIDTag struct {
	ID         uint       `gorm:"primaryKey" json:"id"`
	AnimalID   *uint      `json:"animal_id"` // Can be null if not yet assigned
	Animal     *Livestock `gorm:"foreignKey:AnimalID" json:"animal,omitempty"`
	RFIDNumber string     `gorm:"uniqueIndex;not null" json:"rfid_number"`
	AssignedAt *time.Time `json:"assigned_at"`
	Status     string     `json:"status"` // Active, Inactive, Lost
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}
