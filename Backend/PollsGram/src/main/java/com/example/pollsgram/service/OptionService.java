package com.example.pollsgram.service;

import com.example.pollsgram.dto.OptionDTO;
import com.example.pollsgram.model.Option;
import com.example.pollsgram.repository.OptionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class OptionService {

    private final OptionRepository optionRepository;

    public OptionService(OptionRepository optionRepository) {
        this.optionRepository = optionRepository;
    }

    @Transactional
    public boolean createOption(OptionDTO option) {
        Option optionEntity = new Option();
        BeanUtils.copyProperties(option, optionEntity);
        try {
            optionRepository.save(optionEntity);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
