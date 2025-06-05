package com.example.pollsgram.controller;

import com.example.pollsgram.model.User;
import com.example.pollsgram.service.GoogleService;
import com.example.pollsgram.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final GoogleService googleService;
    private final UserService userService;

    public AuthController(GoogleService googleService, UserService userService) {
        this.googleService = googleService;
        this.userService = userService;
    }

    @PostMapping("/google")
    public ResponseEntity<Map<String, String>> googleLogin(@RequestBody Map<Object, String> credential) {
        Map<String, String> tokens = googleService.verifyGoogleToken(credential.get("credential"));
        if (tokens == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }

        // Create HttpOnly cookie for the refresh token
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", tokens.get("refreshToken"))
                .httpOnly(true)
                .secure(true) // Use secure cookies in production
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .build();

        // Add the cookie to the response header
        return ResponseEntity.ok()
                .header("Set-Cookie", refreshTokenCookie.toString())
                .body(Map.of("accessToken", tokens.get("accessToken")));
    }

    @GetMapping("/access-token")
    public ResponseEntity<Map<String, String>> getAccessToken(@CookieValue(value = "refreshToken", required = false) String refreshToken, @RequestParam Long userId) {
        if (refreshToken == null || userId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token and user ID are required"));
        }
        // Find user by id
        User user = userService.findUserById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        String token = googleService.getAccessToken(refreshToken, user);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
        }
        return ResponseEntity.ok(Map.of("accessToken", token));
    }
}
