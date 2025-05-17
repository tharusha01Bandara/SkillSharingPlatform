package com.example.springsocial.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

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

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;

    // ======================= FOLLOW SYSTEM ========================

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "follower_id"),
            inverseJoinColumns = @JoinColumn(name = "followed_id")
    )
    @JsonIgnore
    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> followers = new HashSet<>();

    // ==================== PROFILE FIELDS ==========================

    @Column(length = 500)
    private String bio;

    private String skills;

    private String interests;

    private String location;

    private String profession;

    // ===================== HELPER METHODS =========================

    public int getFollowersCount() {
        return followers != null ? followers.size() : 0;
    }

    public int getFollowingCount() {
        return following != null ? following.size() : 0;
    }

    @JsonIgnore
    public Set<Long> getFollowingIds() {
        Set<Long> ids = new HashSet<>();
        for (User user : following) {
            ids.add(user.getId());
        }
        return ids;
    }

    @JsonIgnore
    public Set<Long> getFollowerIds() {
        Set<Long> ids = new HashSet<>();
        for (User user : followers) {
            ids.add(user.getId());
        }
        return ids;
    }

    // ================== REQUIRED FOR SET OPERATIONS ==================

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
