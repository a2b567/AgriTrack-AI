package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type AnalyticsRepository struct {
	db *gorm.DB
}

func NewAnalyticsRepository(db *gorm.DB) *AnalyticsRepository {
	return &AnalyticsRepository{db: db}
}

func (r *AnalyticsRepository) GetDashboardStats() (*domain.DashboardStats, error) {
	var stats domain.DashboardStats

	// Count Total Livestock
	r.db.Model(&domain.Livestock{}).Count(&stats.TotalLivestock)

	// Count Vaccinations
	r.db.Model(&domain.Vaccination{}).Count(&stats.TotalVaccinations)

	// Count Active Pregnancies
	r.db.Model(&domain.BreedingRecord{}).Where("pregnancy_status IN ?", []string{"Pending", "Confirmed"}).Count(&stats.ActivePregnancies)

	// Sum Feed Cost
	r.db.Model(&domain.FeedRecord{}).Select("COALESCE(SUM(cost), 0)").Scan(&stats.TotalFeedCost)

	// Sum Total Expenses (Finance Expenses)
	r.db.Model(&domain.Finance{}).Where("type = ?", "Expense").Select("COALESCE(SUM(amount), 0)").Scan(&stats.TotalExpenses)

	// Expense Breakdown
	r.db.Model(&domain.Finance{}).Where("type = ?", "Expense").Select("category as name, COALESCE(SUM(amount), 0) as value").Group("category").Scan(&stats.ExpenseBreakdown)

	// Health Status Breakdown
	r.db.Model(&domain.Livestock{}).Select("health_status as status, count(id) as count").Group("health_status").Scan(&stats.HealthStatusData)

	// Species Breakdown
	r.db.Model(&domain.Livestock{}).Select("species as species, count(id) as count").Group("species").Scan(&stats.SpeciesData)

	return &stats, nil
}
