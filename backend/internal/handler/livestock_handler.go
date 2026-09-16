package handler

import (
	"net/http"
	"strconv"

	"backend/internal/domain"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
)

type LivestockHandler struct {
	livestockService service.LivestockService
}

func NewLivestockHandler(livestockService service.LivestockService) *LivestockHandler {
	return &LivestockHandler{livestockService}
}

func (h *LivestockHandler) Create(c *gin.Context) {
	var livestock domain.Livestock
	if err := c.ShouldBindJSON(&livestock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.livestockService.CreateLivestock(&livestock); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create livestock"})
		return
	}

	c.JSON(http.StatusCreated, livestock)
}

func (h *LivestockHandler) GetAll(c *gin.Context) {
	livestock, err := h.livestockService.GetAllLivestock()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch livestock"})
		return
	}
	c.JSON(http.StatusOK, livestock)
}

func (h *LivestockHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	livestock, err := h.livestockService.GetLivestockByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Livestock not found"})
		return
	}

	c.JSON(http.StatusOK, livestock)
}

func (h *LivestockHandler) GetByRFID(c *gin.Context) {
	rfid := c.Param("rfid")
	livestock, err := h.livestockService.GetLivestockByRFID(rfid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Livestock not found"})
		return
	}

	c.JSON(http.StatusOK, livestock)
}

func (h *LivestockHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var livestock domain.Livestock
	if err := c.ShouldBindJSON(&livestock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	livestock.ID = uint(id)

	if err := h.livestockService.UpdateLivestock(&livestock); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update livestock"})
		return
	}

	c.JSON(http.StatusOK, livestock)
}

func (h *LivestockHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.livestockService.DeleteLivestock(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete livestock"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Livestock deleted successfully"})
}
