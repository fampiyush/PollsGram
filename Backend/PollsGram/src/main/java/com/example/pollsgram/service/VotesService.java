package com.example.pollsgram.service;

import com.example.pollsgram.model.Votes;
import com.example.pollsgram.repository.VotesRepository;
import org.springframework.stereotype.Service;

@Service
public class VotesService {
    private final VotesRepository votesRepository;

    public VotesService(VotesRepository votesRepository) {
        this.votesRepository = votesRepository;
    }

    public void createVote(Votes vote) {
        votesRepository.save(vote);
    }

    public Votes getVote(Long userId, Long pollId) {
        return votesRepository.findByUserIdAndPollId(userId, pollId)
                .orElse(null);
    }

    public void deleteVotesByPoll(Long pollId) {
        Votes vote = votesRepository.findByPollId(pollId)
                .orElse(null);
        if (vote != null) {
            votesRepository.delete(vote);
        }
    }
}
