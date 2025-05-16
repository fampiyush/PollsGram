package com.example.pollsgram.controller;

import com.example.pollsgram.dto.OptionDTO;
import com.example.pollsgram.service.OptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/options")
public class OptionController {

    private final OptionService optionService;

    public OptionController(OptionService optionService) {
        this.optionService = optionService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createOption(@RequestBody OptionDTO option) {
        boolean isCreated = optionService.createOption(option);
        if (isCreated) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Option created successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create option.");
        }
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<String> updateOption(@PathVariable Long id, @RequestBody String optionText) {
        boolean isUpdated = optionService.updateOption(id, optionText);
        if (isUpdated) {
            return ResponseEntity.status(HttpStatus.OK).body("Option updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update option.");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteOption(@PathVariable Long id) {
        boolean isDeleted = optionService.deleteOption(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.OK).body("Option deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete option.");
        }
    }
}
