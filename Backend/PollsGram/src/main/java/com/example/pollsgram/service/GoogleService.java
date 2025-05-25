package com.example.pollsgram.service;

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
    private static final Dotenv dotenv = Dotenv.load();

    public GoogleService(GoogleIdTokenVerifier googleIdTokenVerifier) {
        this.googleIdTokenVerifier = googleIdTokenVerifier;
    }

    public String verifyGoogleToken(String idToken) {
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

            // Create a key for signing
            String secret = dotenv.get("JWT_SECRET");
            Key key = Keys.hmacShaKeyFor(secret.getBytes());

            // Set claims
            Map<String, Object> claims = new HashMap<>();
            claims.put("sub", userId);
            claims.put("email", email);
            claims.put("iat", new Date());
            claims.put("exp", new Date(System.currentTimeMillis() + 15 * 60 * 1000)); // 15 minutes expiration

            // Build the JWT
            String jwt = Jwts.builder()
                    .claims(claims)
                    .signWith(key)
                    .compact();

            return jwt;
        } else {
            return null;
        }
    }
}
