package handler

import (
	"backend/internal/domain"
	"backend/internal/service"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ActivityHandler struct {
	service *service.ActivityService
}

func NewActivityHandler(service *service.ActivityService) *ActivityHandler {
	return &ActivityHandler{service: service}
}

func (h *ActivityHandler) Create(c *gin.Context) {
	var a domain.RFIDActivity
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if a.Timestamp.IsZero() {
		a.Timestamp = time.Now()
	}

	if err := h.service.LogActivity(&a); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to log activity"})
		return
	}

	c.JSON(http.StatusCreated, a)
}

func (h *ActivityHandler) GetByAnimalID(c *gin.Context) {
	animalIDStr := c.Param("id")
	animalID, err := strconv.ParseUint(animalIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid animal ID"})
		return
	}

	activities, err := h.service.GetActivitiesByAnimalID(uint(animalID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch activities"})
		return
	}
	c.JSON(http.StatusOK, activities)
}

func (h *ActivityHandler) GetAll(c *gin.Context) {
	activities, err := h.service.GetAllActivities()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch activities"})
		return
	}
	c.JSON(http.StatusOK, activities)
}
