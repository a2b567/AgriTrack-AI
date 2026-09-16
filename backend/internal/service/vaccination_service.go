package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
)

type VaccinationService struct {
	repo        *repository.VaccinationRepository
	financeRepo *repository.FinanceRepository
}

func NewVaccinationService(repo *repository.VaccinationRepository, financeRepo *repository.FinanceRepository) *VaccinationService {
	return &VaccinationService{repo: repo, financeRepo: financeRepo}
}

func (s *VaccinationService) CreateVaccination(v *domain.Vaccination) error {
	err := s.repo.Create(v)
	if err != nil {
		return err
	}

	if v.Cost > 0 {
		financeRecord := &domain.Finance{
			Type:        "Expense",
			Category:    v.VaccineType, // Uses "Vaccine", "Medicine", or "Vitamin"
			Amount:      v.Cost,
			Description: v.VaccineName,
			Date:        v.DateGiven,
		}
		return s.financeRepo.Create(financeRecord)
	}

	return nil
}

func (s *VaccinationService) GetAllVaccinations() ([]domain.Vaccination, error) {
	return s.repo.GetAll()
}
