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

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Get logged-in user profile
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    // ✅ Update logged-in user profile
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
                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
}
