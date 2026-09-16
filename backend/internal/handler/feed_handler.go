package handler

import (
	"backend/internal/domain"
	"backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FeedHandler struct {
	service *service.FeedService
}

func NewFeedHandler(service *service.FeedService) *FeedHandler {
	return &FeedHandler{service: service}
}

func (h *FeedHandler) Create(c *gin.Context) {
	var f domain.FeedRecord
	if err := c.ShouldBindJSON(&f); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateRecord(&f); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create feed record"})
		return
	}

	c.JSON(http.StatusCreated, f)
}

func (h *FeedHandler) GetAll(c *gin.Context) {
	records, err := h.service.GetAllRecords()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch feed records"})
		return
	}
	c.JSON(http.StatusOK, records)
}
