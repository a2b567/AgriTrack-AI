package handler

import (
	"backend/internal/domain"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WeightHandler struct {
	service *service.WeightService
}

func NewWeightHandler(service *service.WeightService) *WeightHandler {
	return &WeightHandler{service: service}
}

func (h *WeightHandler) Create(c *gin.Context) {
	animalIDStr := c.Param("id")
	animalID, err := strconv.ParseUint(animalIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid animal ID"})
		return
	}

	var w domain.WeightRecord
	if err := c.ShouldBindJSON(&w); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	w.AnimalID = uint(animalID)

	if err := h.service.CreateRecord(&w); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create weight record"})
		return
	}

	c.JSON(http.StatusCreated, w)
}

func (h *WeightHandler) GetByAnimalID(c *gin.Context) {
	animalIDStr := c.Param("id")
	animalID, err := strconv.ParseUint(animalIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid animal ID"})
		return
	}

	records, err := h.service.GetRecordsByAnimalID(uint(animalID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch weight records"})
		return
	}
	c.JSON(http.StatusOK, records)
}
