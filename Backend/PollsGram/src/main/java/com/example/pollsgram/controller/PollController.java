package com.example.pollsgram.controller;
import com.example.pollsgram.dto.PollDTO;
import com.example.pollsgram.model.ReactionType;
import com.example.pollsgram.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/polls")
public class PollController {

    private final PollService pollService;

    @Autowired
    public PollController(PollService pollService) {
        this.pollService = pollService;
    }

    @GetMapping("/page/{pageNumber}")
    public List<PollDTO> listPolls(@PathVariable int pageNumber, @RequestParam Long userId) {
        List<PollDTO> polls = pollService.getPolls(pageNumber, userId);
        return polls;
    }

    @GetMapping("/{id}")
    public PollDTO getPoll(@PathVariable Long id) {
        PollDTO poll = pollService.getPollById(id);
        return poll;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PollDTO>> getPollsByUser(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(List.of());
        }

        List<PollDTO> polls = pollService.getPollsByUser(userId);
        return ResponseEntity.status(HttpStatus.OK).body(polls);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPoll(@RequestBody PollDTO poll) {
        boolean isCreated = pollService.createPoll(poll);
        if (isCreated) {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Poll created successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to create poll."));
        }
    }

    @PostMapping("/vote")
    public ResponseEntity<Map<String, String>> votePoll(@RequestBody Map<String, Long> voteData) {
        boolean isVoted = pollService.votePoll(voteData.get("userId"), voteData.get("pollId"), voteData.get("optionId"));
        if (isVoted) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Vote recorded successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to record vote."));
        }
    }

    @PostMapping("/react")
    public ResponseEntity<Map<String, String>> reactToPoll(@RequestBody Map<String, String> reactionData) {
        boolean isReacted = pollService.reactToPoll(
                Long.parseLong(reactionData.get("userId")),
                Long.parseLong(reactionData.get("pollId")),
                ReactionType.valueOf(reactionData.get("reactionType").toUpperCase())
        );
        if (isReacted) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Reaction recorded successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to record reaction."));
        }
    }

    @PatchMapping("/update/question/{id}")
    public ResponseEntity<Map<String, String>> updatePoll(@PathVariable Long id, @RequestBody String question) {
        boolean isUpdated = pollService.updatePollQuestion(id, question);
        if (isUpdated) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Poll updated successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to update poll."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deletePoll(@PathVariable Long id) {
        boolean isDeleted = pollService.deletePoll(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Poll deleted successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to delete poll."));
        }
    }

    @DeleteMapping("/delete/react/{userid}/{pollid}")
    public ResponseEntity<Map<String, String>> deleteReaction(@PathVariable Long userid, @PathVariable Long pollid) {
        boolean isDeleted = pollService.removeReaction(
                userid,
                pollid
        );
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Reaction deleted successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to delete reaction."));
        }
    }
}