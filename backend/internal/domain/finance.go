package domain

import (
	"time"
)

type Finance struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Type        string    `json:"type"` // "Income" or "Expense"
	Category    string    `json:"category"` // "Feed", "Medicine", "Sale", etc.
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
