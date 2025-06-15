package com.example.pollsgram.repository;

import com.example.pollsgram.model.Votes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotesRepository extends JpaRepository<Votes, Long> {

}
