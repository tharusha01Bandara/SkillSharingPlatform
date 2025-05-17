package com.example.springsocial.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationDTO {
    private Long id;
    private String type;
    private String message;
    private boolean IsRead;
    private LocalDateTime createdAt;
    private UserDTO actor;
    private Long progressId;
}
