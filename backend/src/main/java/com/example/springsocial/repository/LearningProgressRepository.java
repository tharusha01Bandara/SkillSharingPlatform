package com.example.springsocial.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springsocial.model.LearningProgress;
import com.example.springsocial.model.User;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {
    List<LearningProgress> findByUserOrderByCreatedAtDesc(User user);
    List<LearningProgress> findAllByOrderByCreatedAtDesc();
}