package com.example.pollsgram.dto;


import com.example.pollsgram.model.ReactionType;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PollDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    private String question;
    private Long creator_id;
    private List<OptionDTO> options;
    private boolean isVoted;
    private Long votedOptionId;
    private boolean hasReacted;
    private ReactionType reactionType;
    private int likes;
    private int dislikes;

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
    public Long getCreator_id() {
        return creator_id;
    }
    public void setCreator_id(Long creator_id) {
        this.creator_id = creator_id;
    }

    public boolean isVoted() {
        return isVoted;
    }

    public void setVoted(boolean voted) {
        isVoted = voted;
    }

    public Long getVotedOptionId() {
        return votedOptionId;
    }

    public void setVotedOptionId(Long votedOptionId) {
        this.votedOptionId = votedOptionId;
    }

    public boolean getHasReacted() {
        return hasReacted;
    }

    public void setHasReacted(boolean hasReacted) {
        this.hasReacted = hasReacted;
    }

    public ReactionType getReactionType() {
        return reactionType;
    }

    public void setReactionType(ReactionType reactionType) {
        this.reactionType = reactionType;
    }

    public int getLikes() {
        return likes;
    }
    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getDislikes() {
        return dislikes;
    }
    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }
}
