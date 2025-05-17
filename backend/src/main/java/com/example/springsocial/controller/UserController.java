package com.example.springsocial.controller;

import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.User;
import com.example.springsocial.payload.UserProfileUpdateRequest;
import com.example.springsocial.repository.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Get current user
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    // ✅ Update user profile
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateCurrentUser(@CurrentUser UserPrincipal userPrincipal,
                                               @RequestBody UserProfileUpdateRequest updateRequest) {
        return userRepository.findById(userPrincipal.getId())
                .map(user -> {
                    user.setName(updateRequest.getName());
                    user.setBio(updateRequest.getBio());
                    user.setSkills(updateRequest.getSkills());
                    user.setInterests(updateRequest.getInterests());
                    user.setLocation(updateRequest.getLocation());
                    user.setProfession(updateRequest.getProfession());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    // ✅ Follow a user
    @PutMapping("/{id}/follow")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> followUser(@PathVariable Long id, @CurrentUser UserPrincipal currentUser) {
        if (id.equals(currentUser.getId())) {
            return ResponseEntity.badRequest().body("You cannot follow yourself.");
        }

        User me = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        User target = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (!me.getFollowing().contains(target)) {
            me.getFollowing().add(target);
            target.getFollowers().add(me);  // explicitly maintain bidirectional relation
        }

        userRepository.save(me);
        userRepository.save(target);

        return ResponseEntity.ok("Followed user with ID: " + id);
    }

    // ✅ Unfollow a user
    @PutMapping("/{id}/unfollow")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> unfollowUser(@PathVariable Long id, @CurrentUser UserPrincipal currentUser) {
        if (id.equals(currentUser.getId())) {
            return ResponseEntity.badRequest().body("You cannot unfollow yourself.");
        }

        User me = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        User target = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        me.getFollowing().remove(target);
        target.getFollowers().remove(me);

        userRepository.save(me);
        userRepository.save(target);

        return ResponseEntity.ok("Unfollowed user with ID: " + id);
    }

    // ✅ Get followers count
    @GetMapping("/{id}/followers/count")
    public ResponseEntity<?> getFollowersCount(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return ResponseEntity.ok(user.getFollowers().size());
    }

    // ✅ Get following count
    @GetMapping("/{id}/following/count")
    public ResponseEntity<?> getFollowingCount(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return ResponseEntity.ok(user.getFollowing().size());
    }

    // ✅ Get following IDs
    @GetMapping("/{id}/following-ids")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getFollowingIds(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        List<Long> ids = user.getFollowing()
                .stream()
                .map(User::getId)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ids);
    }

    // ✅ Search users
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam("q") String query) {
        List<User> users = userRepository.findByNameContainingIgnoreCase(query);
        return ResponseEntity.ok(users);
    }
}
