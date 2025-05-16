package com.example.pollsgram.service;

import com.example.pollsgram.dto.OptionDTO;
import com.example.pollsgram.model.Option;
import com.example.pollsgram.model.Poll;
import com.example.pollsgram.repository.PollRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.pollsgram.dto.PollDTO;

import java.util.List;

@Service
public class PollService {

    private final PollRepository pollRepository;

    @Autowired
    public PollService(PollRepository pollRepository) {
        this.pollRepository = pollRepository;
    }

    public List<PollDTO> getPolls(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 5);
        try {
            return pollRepository.findAll(pageable).getContent().stream()
                    .map(poll -> {
                        PollDTO pollDTO = new PollDTO();
                        pollToPollDTO(poll, pollDTO);
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
        pollToPollDTO(returned, pollDTO);
        return pollDTO;
    }

    @Transactional
    public Boolean createPoll(PollDTO poll) {
        Poll pollEntity = new Poll();
        pollEntity.setQuestion(poll.getQuestion());
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
            pollRepository.delete(poll);
            return true;
        } catch (Exception e) {
            System.out.println("Error deleting poll: " + e.getMessage());
            return false;
        }
    }

    private void optionToOptionDTO(Option option, OptionDTO optionDTO) {
        optionDTO.setId(option.getId());
        optionDTO.setOptionText(option.getOptionText());
        optionDTO.setVotesCount(option.getVotesCount());
        optionDTO.setPollId(option.getPoll().getId());
    }

    private void pollToPollDTO(Poll poll, PollDTO pollDTO) {
        pollDTO.setId(poll.getId());
        pollDTO.setQuestion(poll.getQuestion());
        pollDTO.setOptions(poll.getOptions().stream()
                .map(option -> {
                    OptionDTO optionDTO = new OptionDTO();
                    optionToOptionDTO(option, optionDTO);
                    return optionDTO;
                })
                .toList());
    }
}