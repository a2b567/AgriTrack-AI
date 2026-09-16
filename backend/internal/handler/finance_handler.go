package handler

import (
	"backend/internal/domain"
	"backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FinanceHandler struct {
	service *service.FinanceService
}

func NewFinanceHandler(service *service.FinanceService) *FinanceHandler {
	return &FinanceHandler{service: service}
}

func (h *FinanceHandler) Create(c *gin.Context) {
	var f domain.Finance
	if err := c.ShouldBindJSON(&f); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateRecord(&f); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create finance record"})
		return
	}

	c.JSON(http.StatusCreated, f)
}

func (h *FinanceHandler) GetAll(c *gin.Context) {
	records, err := h.service.GetAllRecords()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch finance records"})
		return
	}
	c.JSON(http.StatusOK, records)
}
