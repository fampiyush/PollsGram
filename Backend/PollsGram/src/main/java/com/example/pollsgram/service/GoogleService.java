package com.example.pollsgram.service;

import com.example.pollsgram.model.RefreshToken;
import com.example.pollsgram.model.User;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleService {

    private final GoogleIdTokenVerifier googleIdTokenVerifier;
    private final RefreshService refreshService;
    private final UserService userService;
    private static final Dotenv dotenv = Dotenv.load();

    public GoogleService(GoogleIdTokenVerifier googleIdTokenVerifier, RefreshService refreshService, UserService userService) {
        this.googleIdTokenVerifier = googleIdTokenVerifier;
        this.refreshService = refreshService;
        this.userService = userService;
    }

    public Map<String, String> verifyGoogleToken(String idToken) {
        GoogleIdToken token = null;
        try {
            token = googleIdTokenVerifier.verify(idToken);
        } catch (GeneralSecurityException | IOException e) {
            System.err.println("Error verifying token: " + e.getMessage());
        }
        if (idToken != null && token != null) {
            GoogleIdToken.Payload payload = token.getPayload();
            String userId = payload.getSubject(); // Use this value as user ID
            String email = payload.getEmail(); // Use this value as user email

            // If user not found then create a new user
            User user = userService.findUserByEmail(email)
                    .orElseGet(() -> userService.createUser(email));

            if(user == null) {
                return null; // User creation failed
            }

            // Create a refresh token for the user
            RefreshToken refreshToken = refreshService.createRefreshToken(user);
            if (refreshToken == null) {
                return null; // Refresh token creation failed
            }
            String accessToken = getAccessToken(refreshToken.getToken(), user);
            if (accessToken == null) {
                return null; // Access token creation failed
            }
            Map<String, String> returnMap = new HashMap<>();
            returnMap.put("refreshToken", refreshToken.getToken());
            returnMap.put("accessToken", accessToken);
            return returnMap;
        } else {
            return null;
        }
    }

    public String getAccessToken(String refreshToken, User user) {
        RefreshToken token = refreshService.findByUser(user);
        if (token != null && refreshService.isValidToken(token)) {
            // Create a key for signing
            String secret = dotenv.get("JWT_SECRET");
            Key key = Keys.hmacShaKeyFor(secret.getBytes());

            // Set claims
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", user.getId());
            claims.put("email", user.getEmail());
            claims.put("iat", new Date());
            claims.put("exp", new Date(System.currentTimeMillis() + 15 * 60 * 1000)); // 15 minutes expiration

            // Build the JWT
            String jwt = Jwts.builder()
                    .claims(claims)
                    .signWith(key)
                    .compact();

            return jwt;
        }
        return null; // Invalid or expired refresh token
    }
}
