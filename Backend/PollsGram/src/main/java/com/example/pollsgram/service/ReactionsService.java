package com.example.pollsgram.service;

import com.example.pollsgram.model.Poll;
import com.example.pollsgram.model.ReactionType;
import com.example.pollsgram.model.Reaction;
import com.example.pollsgram.model.User;
import com.example.pollsgram.repository.ReactionsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ReactionsService {
    private final ReactionsRepository reactionsRepository;

    public ReactionsService(ReactionsRepository reactionsRepository) {
        this.reactionsRepository = reactionsRepository;
    }

    public void createReaction(User user, Poll poll, ReactionType reactionType) {

        //Check if the user has already reacted to the poll
        Reaction existingReaction = reactionsRepository.findByUserAndPoll(user, poll).orElse(null);
        if (existingReaction != null) {
            // If the user has already reacted, update the reaction type
            existingReaction.setReactionType(reactionType);
            reactionsRepository.save(existingReaction);
            if(reactionType == ReactionType.LIKE) {
                poll.setDislikes(Math.max(0, poll.getDislikes() - 1));
            }else {
                poll.setLikes(Math.max(0, poll.getLikes() - 1));
            }
            return;
        }

        Reaction reaction = new Reaction();
        reaction.setUser(user);
        reaction.setPoll(poll);
        reaction.setReactionType(reactionType);

        Reaction re = reactionsRepository.save(reaction);
        poll.addReaction(re);
    }

    public Reaction getReaction(User user, Poll poll) {
        return reactionsRepository.findByUserAndPoll(user, poll).orElse(null);
    }

    @Transactional
    public void deleteReaction(User user, Poll poll) {
        Reaction reaction = reactionsRepository.findByUserAndPoll(user, poll).orElse(null);
        if (reaction != null) {
            poll.removeReaction(reaction);
            reactionsRepository.delete(reaction);
        }
    }
}
