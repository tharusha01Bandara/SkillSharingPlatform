package com.example.springsocial.repository;

import com.example.springsocial.model.Follow;
import com.example.springsocial.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    // Count how many users this user is following
    Long countByFollower(User user);

    // Count how many users follow this user
    Long countByFollowing(User user);

    // Check if a user is already following another
    boolean existsByFollowerAndFollowing(User follower, User following);

    // Unfollow (delete relationship)
    void deleteByFollowerAndFollowing(User follower, User following);
}
