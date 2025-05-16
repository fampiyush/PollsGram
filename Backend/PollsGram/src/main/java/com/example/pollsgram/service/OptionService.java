package com.example.pollsgram.service;

import com.example.pollsgram.dto.OptionDTO;
import com.example.pollsgram.model.Option;
import com.example.pollsgram.model.Poll;
import com.example.pollsgram.repository.OptionRepository;
import com.example.pollsgram.repository.PollRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class OptionService {

    private final OptionRepository optionRepository;
    private final PollRepository pollRepository;

    public OptionService(OptionRepository optionRepository, PollRepository pollRepository) {
        this.optionRepository = optionRepository;
        this.pollRepository = pollRepository;
    }

    @Transactional
    public boolean createOption(OptionDTO option) {
        Option optionEntity = new Option();
        optionEntity.setOptionText(option.getOptionText());
        Poll poll = pollRepository.findById(option.getPollId()).orElse(null);
        if (poll == null) {
            return false;
        }
        optionEntity.setPoll(poll);
        try {
            optionRepository.save(optionEntity);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public boolean updateOption(Long id, String optionText) {
        Option option = optionRepository.findById(id).orElse(null);
        if (option == null) {
            return false;
        }
        option.setOptionText(optionText);
        try {
            optionRepository.save(option);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public boolean deleteOption(Long id) {
        Option option = optionRepository.findById(id).orElse(null);
        if (option == null) {
            return false;
        }
        try {
            optionRepository.delete(option);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
