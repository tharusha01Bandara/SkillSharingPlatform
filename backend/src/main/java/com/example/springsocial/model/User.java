package com.example.springsocial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @JsonIgnore
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private List<User> followers = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "follower_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> following = new ArrayList<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;

    // Additional Profile Fields
    @Column(length = 500)
    private String bio;

    private String skills;

    private String interests;

    private String location;

    private String profession;

    // Getters and Setters (if needed manually in addition to Lombok)

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getImageUrl() { return imageUrl; }

    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getEmailVerified() { return emailVerified; }

    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public List<User> getFollowers() { return followers; }

    public void setFollowers(List<User> followers) { this.followers = followers; }

    public List<User> getFollowing() { return following; }

    public void setFollowing(List<User> following) { this.following = following; }

    public AuthProvider getProvider() { return provider; }

    public void setProvider(AuthProvider provider) { this.provider = provider; }

    public String getProviderId() { return providerId; }

    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getBio() { return bio; }

    public void setBio(String bio) { this.bio = bio; }

    public String getSkills() { return skills; }

    public void setSkills(String skills) { this.skills = skills; }

    public String getInterests() { return interests; }

    public void setInterests(String interests) { this.interests = interests; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getProfession() { return profession; }

    public void setProfession(String profession) { this.profession = profession; }
}
