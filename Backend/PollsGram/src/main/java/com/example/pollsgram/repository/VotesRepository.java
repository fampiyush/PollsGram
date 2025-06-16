package com.example.pollsgram.repository;

import com.example.pollsgram.model.Votes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VotesRepository extends JpaRepository<Votes, Long> {
    Optional<Votes> findByUserIdAndPollId(Long userId, Long pollId);
}
