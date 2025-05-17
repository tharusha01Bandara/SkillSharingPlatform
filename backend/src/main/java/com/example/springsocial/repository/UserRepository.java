package com.example.springsocial.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springsocial.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByName(String Name);
    Boolean existsByName(String Name);
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

}
