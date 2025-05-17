package com.example.springsocial.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LearningProgressDTO {
    private Long id;
    private String title;
    private String content;
    private String tutorialCompleted;
    private String skillsLearned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO user;
    private int commentCount;
    private int likeCount;
    private boolean currentUserLiked;
}

