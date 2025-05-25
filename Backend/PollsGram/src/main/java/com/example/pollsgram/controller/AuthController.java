package com.example.pollsgram.controller;

import com.example.pollsgram.service.GoogleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final GoogleService googleService;

    public AuthController(GoogleService googleService) {
        this.googleService = googleService;
    }

    @PostMapping("/google")
    public ResponseEntity<Map<String, String>> googleLogin(@RequestBody Map<Object, String> credential) {
        String token = googleService.verifyGoogleToken(credential.get("credential"));
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }
        return ResponseEntity.ok(Map.of("token", token));
    }
}
