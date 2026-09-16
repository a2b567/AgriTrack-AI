package handler

import (
	"backend/internal/domain"
	"backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type VaccinationHandler struct {
	service *service.VaccinationService
}

func NewVaccinationHandler(service *service.VaccinationService) *VaccinationHandler {
	return &VaccinationHandler{service: service}
}

func (h *VaccinationHandler) Create(c *gin.Context) {
	var v domain.Vaccination
	if err := c.ShouldBindJSON(&v); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateVaccination(&v); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vaccination"})
		return
	}

	c.JSON(http.StatusCreated, v)
}

func (h *VaccinationHandler) GetAll(c *gin.Context) {
	vaccinations, err := h.service.GetAllVaccinations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vaccinations"})
		return
	}
	c.JSON(http.StatusOK, vaccinations)
}
