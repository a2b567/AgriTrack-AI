package main

import (
	"log"
	"backend/internal/domain"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("agritrack.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	var feeds []domain.FeedRecord
	db.Find(&feeds)

	for _, f := range feeds {
		var count int64
		db.Model(&domain.Finance{}).Where("description = ?", f.FeedType+" feed").Count(&count)
		if count == 0 {
			financeRecord := &domain.Finance{
				Type:        "Expense",
				Category:    "Feed",
				Amount:      f.Cost,
				Description: f.FeedType + " feed",
				Date:        f.DateRecorded,
			}
			db.Create(financeRecord)
		}
	}
	log.Println("Migration complete")
}
