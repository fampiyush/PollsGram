package com.example.pollsgram.repository;

import com.example.pollsgram.model.Poll;
import com.example.pollsgram.model.Reactions;
import com.example.pollsgram.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReactionsRepository extends JpaRepository<Reactions, Long> {
    Reactions findByUserAndPoll(User user, Poll poll);
}
