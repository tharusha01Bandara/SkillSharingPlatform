package com.example.springsocial.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.springsocial.model.Comment;
import com.example.springsocial.model.LearningProgress;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByLearningProgressOrderByCreatedAtAsc(LearningProgress learningProgress);
}
