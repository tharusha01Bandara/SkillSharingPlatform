package com.example.springsocial.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springsocial.model.SkillPost;

@Repository
public interface SkillPostRepository extends JpaRepository<SkillPost, Long> {
    
}

