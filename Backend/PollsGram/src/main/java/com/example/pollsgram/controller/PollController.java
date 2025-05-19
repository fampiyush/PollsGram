package com.example.pollsgram.controller;
import com.example.pollsgram.dto.PollDTO;
import com.example.pollsgram.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/polls")
@CrossOrigin(origins = "*")
public class PollController {

    private final PollService pollService;

    @Autowired
    public PollController(PollService pollService) {
        this.pollService = pollService;
    }

    @GetMapping("/page/{pageNumber}")
    public List<PollDTO> listPolls(@PathVariable int pageNumber) {
        List<PollDTO> polls = pollService.getPolls(pageNumber);
        return polls;
    }

    @GetMapping("/{id}")
    public PollDTO getPoll(@PathVariable Long id) {
        PollDTO poll = pollService.getPollById(id);
        return poll;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPoll(@RequestBody PollDTO poll) {
        boolean isCreated = pollService.createPoll(poll);
        if (isCreated) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Poll created successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create poll.");
        }
    }

    @PatchMapping("/update/question/{id}")
    public ResponseEntity<String> updatePoll(@PathVariable Long id, @RequestBody String question) {
        boolean isUpdated = pollService.updatePollQuestion(id, question);
        if (isUpdated) {
            return ResponseEntity.status(HttpStatus.OK).body("Poll updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update poll.");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePoll(@PathVariable Long id) {
        boolean isDeleted = pollService.deletePoll(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.OK).body("Poll deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete poll.");
        }
    }
}