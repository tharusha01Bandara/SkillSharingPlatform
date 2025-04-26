package com.example.springsocial.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springsocial.model.LearningPlan;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    
}
