package com.example.springsocial.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springsocial.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByName(String name);
    Boolean existsByName(String name);

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    // 🔍 For search feature (name contains text)
    List<User> findByNameContainingIgnoreCase(String query);
}
