package configs

import (
	"testing"

	"backend/internal/domain"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func TestSeedDefaultUser(t *testing.T) {
	db, err := gorm.Open(sqlite.Open("file:memdb1?mode=memory&cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open in-memory DB: %v", err)
	}
	defer func() {
		sqlDB, sqlErr := db.DB()
		if sqlErr == nil {
			_ = sqlDB.Close()
		}
	}()

	if err := db.AutoMigrate(&domain.User{}); err != nil {
		t.Fatalf("failed to migrate user table: %v", err)
	}

	if err := SeedDefaultUsers(db); err != nil {
		t.Fatalf("seed default users: %v", err)
	}

	var user domain.User
	if err := db.Where("email = ?", "farmer@agritrack.ai").First(&user).Error; err != nil {
		t.Fatalf("default demo user was not created: %v", err)
	}

	if user.PasswordHash == "" {
		t.Fatal("demo user was created without a password hash")
	}
}
