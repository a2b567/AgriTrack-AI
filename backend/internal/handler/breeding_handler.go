package handler

import (
	"backend/internal/domain"
	"backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BreedingHandler struct {
	service *service.BreedingService
}

func NewBreedingHandler(service *service.BreedingService) *BreedingHandler {
	return &BreedingHandler{service: service}
}

func (h *BreedingHandler) Create(c *gin.Context) {
	var b domain.BreedingRecord
	if err := c.ShouldBindJSON(&b); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateRecord(&b); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create breeding record"})
		return
	}

	c.JSON(http.StatusCreated, b)
}

func (h *BreedingHandler) GetAll(c *gin.Context) {
	records, err := h.service.GetAllRecords()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch breeding records"})
		return
	}
	c.JSON(http.StatusOK, records)
}
