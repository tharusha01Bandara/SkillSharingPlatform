package com.example.springsocial.controller;

import com.example.springsocial.model.Follow;
import com.example.springsocial.model.User;
import com.example.springsocial.repository.FollowRepository;
import com.example.springsocial.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Follow a user
    @PostMapping("/{userId}")
    public ResponseEntity<?> followUser(@AuthenticationPrincipal User currentUser,
                                        @PathVariable Long userId) {

        if (currentUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("You cannot follow yourself.");
        }

        User toFollow = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyFollowing = followRepository.existsByFollowerAndFollowing(currentUser, toFollow);

        if (!alreadyFollowing) {
            Follow follow = new Follow();
            follow.setFollower(currentUser);
            follow.setFollowing(toFollow);
            followRepository.save(follow);
        }

        return ResponseEntity.ok("Followed user " + userId);
    }

    // ✅ Unfollow a user
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollowUser(@AuthenticationPrincipal User currentUser,
                                          @PathVariable Long userId) {

        User toUnfollow = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        followRepository.deleteByFollowerAndFollowing(currentUser, toUnfollow);

        return ResponseEntity.ok("Unfollowed user " + userId);
    }

    // ✅ Get follower/following count
    @GetMapping("/count/{userId}")
    public ResponseEntity<?> getFollowCounts(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long followers = followRepository.countByFollowing(user);
        Long following = followRepository.countByFollower(user);

        Map<String, Long> counts = new HashMap<>();
        counts.put("followers", followers);
        counts.put("following", following);

        return ResponseEntity.ok(counts);
    }
}
