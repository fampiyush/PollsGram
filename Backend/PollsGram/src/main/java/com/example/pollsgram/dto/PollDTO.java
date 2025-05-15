package com.example.pollsgram.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PollDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    private String question;
    private List<OptionDTO> options;

    public String getQuestion() {
        return question;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<OptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<OptionDTO> options) {
        this.options = options;
    }
}
