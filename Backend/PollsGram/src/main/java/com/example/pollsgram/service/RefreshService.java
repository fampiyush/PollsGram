package com.example.pollsgram.service;

import com.example.pollsgram.model.RefreshToken;
import com.example.pollsgram.model.User;
import com.example.pollsgram.repository.RefreshRepository;
import org.springframework.stereotype.Service;

@Service
public class RefreshService {
    private final RefreshRepository refreshRepository;

    public RefreshService(RefreshRepository refreshRepository) {
        this.refreshRepository = refreshRepository;
    }

    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        // Generate a unique token, e.g., using UUID
        refreshToken.setToken(java.util.UUID.randomUUID().toString());
        // Set the creation date
        refreshToken.setCreatedAt(new java.util.Date());
        return refreshRepository.save(refreshToken);
    }

    public boolean isValidToken(RefreshToken token) {
        return refreshRepository.findById(token.getUser().getId())
                .map(refreshToken -> {
                    long diffInMillis = new java.util.Date().getTime() - refreshToken.getCreatedAt().getTime();
                    long diffInDays = diffInMillis / (1000 * 60 * 60 * 24);
                    if (diffInDays > 7) {
                        refreshRepository.delete(refreshToken);
                        return false;
                    }
                    return true;
                })
                .orElse(false);
    }

    public RefreshToken findByUser(User user) {
        return refreshRepository.findById(user.getId())
                .orElse(null);
    }
}
