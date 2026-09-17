package configs

import (
	"fmt"
	"log"
	"os"

	"backend/internal/domain"
	"backend/pkg/utils"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func fallbackSQLite() (*gorm.DB, error) {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "agritrack.db" // local development fallback
	}
	return gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
}

func importSqlite() {} // dummy func

func SeedDefaultUsers(db *gorm.DB) error {
	var existing domain.User
	if err := db.Where("email = ?", "farmer@agritrack.ai").First(&existing).Error; err == nil {
		return nil
	}

	hashedPassword, err := utils.HashPassword("Password123")
	if err != nil {
		return err
	}

	user := &domain.User{
		FirstName:    "Farmer",
		LastName:     "Demo",
		Email:        "farmer@agritrack.ai",
		PasswordHash: hashedPassword,
		RoleID:       2,
	}

	return db.Create(user).Error
}
func ConnectDatabase() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = os.Getenv("DIRECT_URL")
	}
	var dsn string
	if databaseURL != "" {
		dsn = databaseURL
	} else {
		host := os.Getenv("DB_HOST")
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		dbname := os.Getenv("DB_NAME")
		port := os.Getenv("DB_PORT")
		sslmode := os.Getenv("DB_SSLMODE")
		if sslmode == "" {
			sslmode = "disable"
		}
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Shanghai",
			host, user, password, dbname, port, sslmode)
	}

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("PostgreSQL connection failed, falling back to SQLite for testing...")
		importSqlite()
		database, err = fallbackSQLite()
		if err != nil {
			log.Fatal("Failed to connect to database:", err)
		}
	}

	err = database.AutoMigrate(
		&domain.Role{},
		&domain.Permission{},
		&domain.User{},
		&domain.Livestock{},
		&domain.RFIDTag{},
		&domain.HealthRecord{},
		&domain.Vaccination{},
		&domain.BreedingRecord{},
		&domain.FeedRecord{},
		&domain.Finance{},
		&domain.WeightRecord{},
		&domain.Notification{},
		&domain.RFIDActivity{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = database
	if err := SeedDefaultUsers(database); err != nil {
		log.Fatal("Failed to seed default users:", err)
	}
	log.Println("Database connection established and migrated successfully")
}
