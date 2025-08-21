package com.example.pollsgram.service;

import com.example.pollsgram.model.Poll;
import com.example.pollsgram.model.ReactionType;
import com.example.pollsgram.model.Reaction;
import com.example.pollsgram.model.User;
import com.example.pollsgram.repository.ReactionsRepository;
import org.springframework.stereotype.Service;

@Service
public class ReactionsService {
    private final ReactionsRepository reactionsRepository;

    public ReactionsService(ReactionsRepository reactionsRepository) {
        this.reactionsRepository = reactionsRepository;
    }

    public void createReaction(User user, Poll poll, ReactionType reactionType) {

        //Check if the user has already reacted to the poll
        Reaction existingReaction = reactionsRepository.findByUserAndPoll(user, poll);
        if (existingReaction != null) {
            // If the user has already reacted, update the reaction type
            existingReaction.setReactionType(reactionType);
            reactionsRepository.save(existingReaction);
            return;
        }

        Reaction reaction = new Reaction();
        reaction.setUser(user);
        reaction.setPoll(poll);
        reaction.setReactionType(reactionType);

        reactionsRepository.save(reaction);
    }

    public Reaction getReaction(User user, Poll poll) {
        return reactionsRepository.findByUserAndPoll(user, poll);
    }

    public void deleteReaction(User user, Poll poll) {
        Reaction reaction = reactionsRepository.findByUserAndPoll(user, poll);
        if (reaction != null) {
            reactionsRepository.delete(reaction);
        }
    }
}
