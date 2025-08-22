package com.example.pollsgram.repository;

import com.example.pollsgram.model.Poll;
import com.example.pollsgram.model.Reaction;
import com.example.pollsgram.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionsRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndPoll(User user, Poll poll);
}
