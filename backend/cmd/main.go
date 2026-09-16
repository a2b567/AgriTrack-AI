package main

import (
	"log"
	"os"

	"backend/configs"
	"backend/internal/handler"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found, using environment variables")
	}

	configs.ConnectDatabase()

	r := gin.Default()

	// CORS middleware would go here
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Root Route
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Welcome to AgriTrack AI Backend. Access API at /api/v1/health"})
	})

	r.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "AgriTrack AI API is running"})
	})

	// Serve React frontend static files in production
	r.Static("/assets", "./static/assets")
	r.StaticFile("/favicon.ico", "./static/favicon.ico")
	r.NoRoute(func(c *gin.Context) {
		// If the route is not an API route, serve the React app
		if len(c.Request.URL.Path) < 4 || c.Request.URL.Path[:4] != "/api" {
			c.File("./static/index.html")
		} else {
			c.JSON(404, gin.H{"error": "Not found"})
		}
	})

	// Setup Repositories
	userRepo := repository.NewUserRepository(configs.DB)
	livestockRepo := repository.NewLivestockRepository(configs.DB)
	vaccinationRepo := repository.NewVaccinationRepository(configs.DB)
	breedingRepo := repository.NewBreedingRepository(configs.DB)
	feedRepo := repository.NewFeedRepository(configs.DB)
	analyticsRepo := repository.NewAnalyticsRepository(configs.DB)
	financeRepo := repository.NewFinanceRepository(configs.DB)
	weightRepo := repository.NewWeightRepository(configs.DB)
	notificationRepo := repository.NewNotificationRepository(configs.DB)
	activityRepo := repository.NewActivityRepository(configs.DB)
	
	// Setup Services
	authService := service.NewAuthService(userRepo)
	livestockService := service.NewLivestockService(livestockRepo)
	vaccinationService := service.NewVaccinationService(vaccinationRepo, financeRepo)
	breedingService := service.NewBreedingService(breedingRepo)
	feedService := service.NewFeedService(feedRepo, financeRepo)
	analyticsService := service.NewAnalyticsService(analyticsRepo)
	financeService := service.NewFinanceService(financeRepo)
	weightService := service.NewWeightService(weightRepo)
	notificationService := service.NewNotificationService(notificationRepo)
	activityService := service.NewActivityService(activityRepo)
	
	// Setup Handlers
	authHandler := handler.NewAuthHandler(authService)
	livestockHandler := handler.NewLivestockHandler(livestockService)
	vaccinationHandler := handler.NewVaccinationHandler(vaccinationService)
	breedingHandler := handler.NewBreedingHandler(breedingService)
	feedHandler := handler.NewFeedHandler(feedService)
	analyticsHandler := handler.NewAnalyticsHandler(analyticsService)
	financeHandler := handler.NewFinanceHandler(financeService)
	weightHandler := handler.NewWeightHandler(weightService)
	notificationHandler := handler.NewNotificationHandler(notificationService)
	activityHandler := handler.NewActivityHandler(activityService)

	// Routes
	v1 := r.Group("/api/v1")
	{
		authRoutes := v1.Group("/auth")
		{
			authRoutes.POST("/register", authHandler.Register)
			authRoutes.POST("/login", authHandler.Login)
		}
		
		// Analytics Routes
		analyticsRoutes := v1.Group("/analytics")
		{
			analyticsRoutes.GET("/dashboard", analyticsHandler.GetDashboard)
		}

		// Livestock Routes
		livestockRoutes := v1.Group("/livestock")
		{
			livestockRoutes.POST("/", livestockHandler.Create)
			livestockRoutes.GET("/", livestockHandler.GetAll)
			livestockRoutes.GET("/:id", livestockHandler.GetByID)
			livestockRoutes.GET("/rfid/:rfid", livestockHandler.GetByRFID)
			livestockRoutes.PUT("/:id", livestockHandler.Update)
			livestockRoutes.DELETE("/:id", livestockHandler.Delete)

			// Weight Monitoring routes
			livestockRoutes.POST("/:id/weight", weightHandler.Create)
			livestockRoutes.GET("/:id/weight", weightHandler.GetByAnimalID)
		}

		// Vaccination Routes
		vaccinationRoutes := v1.Group("/vaccinations")
		{
			vaccinationRoutes.POST("/", vaccinationHandler.Create)
			vaccinationRoutes.GET("/", vaccinationHandler.GetAll)
		}

		// Breeding Routes
		breedingRoutes := v1.Group("/breeding")
		{
			breedingRoutes.POST("/", breedingHandler.Create)
			breedingRoutes.GET("/", breedingHandler.GetAll)
		}

		// Feed Routes
		feedGroup := v1.Group("/feed")
		{
			feedGroup.POST("/", feedHandler.Create)
			feedGroup.GET("/", feedHandler.GetAll)
		}

		financeGroup := v1.Group("/finance")
		{
			financeGroup.POST("/", financeHandler.Create)
			financeGroup.GET("/", financeHandler.GetAll)
		}

		notificationGroup := v1.Group("/notifications")
		{
			notificationGroup.GET("/", notificationHandler.GetUnread)
			notificationGroup.PUT("/:id/read", notificationHandler.MarkAsRead)
		}

		activityGroup := v1.Group("/activities")
		{
			activityGroup.POST("/", activityHandler.Create)
			activityGroup.GET("/", activityHandler.GetAll)
			activityGroup.GET("/livestock/:id", activityHandler.GetByAnimalID)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	r.Run(":" + port)
}
