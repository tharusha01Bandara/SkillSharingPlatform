package com.example.springsocial.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    //private String fullName;
    //private String bio;
    private String imageUrl;
    private int followerCount;
    private int followingCount;
    private boolean currentUserFollowing;
}