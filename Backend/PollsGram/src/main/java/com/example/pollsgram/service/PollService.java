package com.example.pollsgram.service;

import com.example.pollsgram.dto.OptionDTO;
import com.example.pollsgram.model.*;
import com.example.pollsgram.repository.PollRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.pollsgram.dto.PollDTO;

import java.util.List;

@Service
public class PollService {

    private final PollRepository pollRepository;
    private final UserService userService;
    private final VotesService votesService;
    private final ReactionsService reactionsService;

    @Autowired
    public PollService(PollRepository pollRepository, UserService userService, VotesService votesService,
                       ReactionsService reactionsService) {
        this.pollRepository = pollRepository;
        this.userService = userService;
        this.votesService = votesService;
        this.reactionsService = reactionsService;
    }

    public List<PollDTO> getPolls(int pageNumber, Long userId) {
        Pageable pageable = PageRequest.of(pageNumber, 5);
        try {
            return pollRepository.findAll(pageable).getContent().stream()
                    .map(poll -> {
                        PollDTO pollDTO = new PollDTO();
                        pollToPollDTO(poll, pollDTO, userId);
                        return pollDTO;
                    })
                    .toList();
        } catch (Exception e) {
            System.out.println("Error fetching polls: " + e.getMessage());
            return List.of();
        }
    }

    public PollDTO getPollById(Long id) {
        Poll returned = pollRepository.findById(id).orElse(null);
        if (returned == null) {
            return null;
        }
        PollDTO pollDTO = new PollDTO();
        pollToPollDTO(returned, pollDTO, id);
        return pollDTO;
    }

    public List<PollDTO> getPollsByUser(Long userId) {
        List<Poll> polls = pollRepository.findAllByCreatorId(userId);
        return polls.stream()
                .map(poll -> {
                    PollDTO pollDTO = new PollDTO();
                    pollToPollDTO(poll, pollDTO, userId);
                    return pollDTO;
                })
                .toList();
    }

    @Transactional
    public Boolean createPoll(PollDTO poll) {
        Poll pollEntity = new Poll();
        pollEntity.setQuestion(poll.getQuestion());
        pollEntity.setCreator(userService.getUserById(poll.getCreator_id()));
        pollEntity.setOptions(poll.getOptions().stream()
                .map(optionDTO -> {
                    Option option = new Option();
                    option.setOptionText(optionDTO.getOptionText());
                    option.setPoll(pollEntity);
                    return option;
                })
                .toList());
        try {
            pollRepository.save(pollEntity);
            return true;
        } catch (Exception e) {
            System.out.println("Error creating poll: " + e.getMessage());
            return false;
        }
    }

    @Transactional
    public Boolean updatePollQuestion(Long id, String question) {
        Poll poll = pollRepository.findById(id).orElse(null);
        if (poll == null) {
            return false;
        }
        poll.setQuestion(question);
        try {
            pollRepository.save(poll);
            return true;
        } catch (Exception e) {
            System.out.println("Error updating poll: " + e.getMessage());
            return false;
        }
    }

    @Transactional
    public Boolean deletePoll(Long id) {
        Poll poll = pollRepository.findById(id).orElse(null);
        if (poll == null) {
            return false;
        }
        try {
            votesService.deleteVotesByPoll(id); // Delete associated votes
            pollRepository.delete(poll);
            return true;
        } catch (Exception e) {
            System.out.println("Error deleting poll: " + e.getMessage());
            return false;
        }
    }

    @Transactional
    public Boolean votePoll(Long userId, Long pollId, Long optionId) {
        Poll poll = pollRepository.findById(pollId).orElse(null);
        if (poll == null) {
            return false;
        }
        Option option = poll.getOptions().stream()
                .filter(opt -> opt.getId().equals(optionId))
                .findFirst()
                .orElse(null);
        if (option == null) {
            return false;
        }

        Votes vote = new Votes();
        vote.setUser(userService.getUserById(userId));
        vote.setPoll(poll);
        vote.setOption(option);

        try {
            votesService.createVote(vote); // Save the vote
            option.setVotesCount(option.getVotesCount() + 1); // Increment vote count
            return true;
        } catch (Exception e) {
            System.out.println("Error voting on poll: " + e.getMessage());
            return false;
        }
    }

    private void optionToOptionDTO(Option option, OptionDTO optionDTO) {
        optionDTO.setId(option.getId());
        optionDTO.setOptionText(option.getOptionText());
        optionDTO.setVotesCount(option.getVotesCount());
        optionDTO.setPollId(option.getPoll().getId());
    }

    private void pollToPollDTO(Poll poll, PollDTO pollDTO, Long userId) {
        Votes vote = votesService.getVote(userId, poll.getId());
        if (vote != null) {
            pollDTO.setVoted(true);
            pollDTO.setVotedOptionId(vote.getOption().getId());
        } else {
            pollDTO.setVoted(false);
            pollDTO.setVotedOptionId(null);
        }
        pollDTO.setId(poll.getId());
        pollDTO.setQuestion(poll.getQuestion());
        pollDTO.setLikes(poll.getLikes());
        pollDTO.setDislikes(poll.getDislikes());
        pollDTO.setOptions(poll.getOptions().stream()
                .map(option -> {
                    OptionDTO optionDTO = new OptionDTO();
                    optionToOptionDTO(option, optionDTO);
                    return optionDTO;
                })
                .toList());
    }

    @Transactional
    public boolean likePoll(Long pollId, Long userId) {
        Poll poll = pollRepository.findById(pollId).orElse(null);
        if (poll == null) {
            return false;
        }

        User user = userService.getUserById(userId);
        if (user == null) {
            return false;
        }

        reactionsService.createReaction(user, poll, ReactionType.LIKE);
        poll.setLikes(poll.getLikes() + 1);
        try {
            pollRepository.save(poll);
            return true;
        } catch (Exception e) {
            System.out.println("Error liking poll: " + e.getMessage());
            return false;
        }
    }

    @Transactional
    public boolean dislikePoll(Long pollId, Long userId) {
        Poll poll = pollRepository.findById(pollId).orElse(null);
        if (poll == null) {
            return false;
        }

        User user = userService.getUserById(userId);
        if (user == null) {
            return false;
        }

        reactionsService.createReaction(user, poll, ReactionType.DISLIKE);
        poll.setDislikes(poll.getDislikes() + 1);
        try {
            pollRepository.save(poll);
            return true;
        } catch (Exception e) {
            System.out.println("Error disliking poll: " + e.getMessage());
            return false;
        }
    }
}