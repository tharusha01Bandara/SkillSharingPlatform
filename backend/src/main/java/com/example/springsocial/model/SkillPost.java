package com.example.springsocial.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Column;
import java.time.LocalDateTime;
import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class SkillPost {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String imageUrls;  // Single string to store URLs for images or videos (e.g., comma-separated URLs)

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "skill_post_likes",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> likes = new HashSet<>();

    public SkillPost() {
        // Default constructor
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(String imageUrls) {
        this.imageUrls = imageUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<User> getLikes() {
        return likes;
    }

    public void setLikes(Set<User> likes) {
        this.likes = likes;
    }

    public void addLike(User user) {
        this.likes.add(user);
    }

    public void removeLike(User user) {
        this.likes.remove(user);
    }

    public boolean isLikedBy(User user) {
        return this.likes.contains(user);
    }

    public int getLikesCount() {
        return this.likes.size();
    }
}
