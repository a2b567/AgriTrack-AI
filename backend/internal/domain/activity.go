package domain

import (
	"time"
)

type RFIDActivity struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	AnimalID     uint      `json:"animal_id"`
	RFIDNumber   string    `json:"rfid_number"`
	ActivityType string    `json:"activity_type"` // e.g. "Scanned", "Vaccinated", "Fed"
	Location     string    `json:"location"`      // e.g. "Gate A", "Barn 1"
	Timestamp    time.Time `json:"timestamp"`
}
