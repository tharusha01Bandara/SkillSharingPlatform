package com.example.springsocial.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private UserDTO user;
    private int likeCount;
    private boolean currentUserLiked;
}
