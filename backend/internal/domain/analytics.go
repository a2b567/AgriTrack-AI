package domain

type DashboardStats struct {
	TotalLivestock    int64 `json:"total_livestock"`
	TotalVaccinations int64 `json:"total_vaccinations"`
	ActivePregnancies int64 `json:"active_pregnancies"`
	TotalFeedCost     float64 `json:"total_feed_cost"`
	TotalExpenses     float64 `json:"total_expenses"`
	ExpenseBreakdown  []ExpenseStat `json:"expense_breakdown"`
	HealthStatusData  []HealthStat `json:"health_status_data"`
	SpeciesData       []SpeciesStat `json:"species_data"`
}

type ExpenseStat struct {
	Category string  `json:"name"`
	Amount   float64 `json:"value"`
}

type HealthStat struct {
	Status string `json:"name"`
	Count  int64  `json:"value"`
}

type SpeciesStat struct {
	Species string `json:"name"`
	Count   int64  `json:"value"`
}
