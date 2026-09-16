package service

import (
	"errors"
	"backend/internal/domain"
	"backend/internal/repository"
	"backend/pkg/utils"
)

type AuthService interface {
	Register(user *domain.User, password string) error
	Login(email, password string) (string, *domain.User, error)
}

type authService struct {
	repo repository.UserRepository
}

func NewAuthService(repo repository.UserRepository) AuthService {
	return &authService{repo}
}

func (s *authService) Register(user *domain.User, password string) error {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return err
	}
	user.PasswordHash = hashedPassword

	// Assign default role (Farm Worker) if not provided. In real world, we'd look up role ID
	if user.RoleID == 0 {
		user.RoleID = 2 // Assuming 1=SuperAdmin, 2=FarmWorker, etc.
	}

	return s.repo.CreateUser(user)
}

func (s *authService) Login(email, password string) (string, *domain.User, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", nil, errors.New("invalid email or password")
	}

	if !utils.CheckPasswordHash(password, user.PasswordHash) {
		return "", nil, errors.New("invalid email or password")
	}

	token, err := utils.GenerateToken(user.ID, user.RoleID)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}
