package com.example.springsocial.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springsocial.dto.CommentDTO;
import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.Comment;
import com.example.springsocial.model.LearningProgress;
import com.example.springsocial.model.Notification;
import com.example.springsocial.model.User;
import com.example.springsocial.repository.CommentRepository;
import com.example.springsocial.repository.LearningProgressRepository;
import com.example.springsocial.repository.NotificationRepository;
import com.example.springsocial.repository.UserRepository;
import com.example.springsocial.util.DtoConverter;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private LearningProgressRepository progressRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private DtoConverter dtoConverter;
    
    @Transactional
    public CommentDTO addComment(Long progressId, CommentDTO commentDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
        
        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setUser(user);
        comment.setLearningProgress(progress);
        
        Comment savedComment = commentRepository.save(comment);
        
        // Create notification for progress owner
        if (!progress.getUser().getId().equals(userId)) {
            Notification notification = new Notification();
            notification.setType("COMMENT");
            notification.setMessage(user.getName() + " commented on your learning progress update");
            notification.setRecipient(progress.getUser());
            notification.setActor(user);
            notification.setLearningProgress(progress);
            notificationRepository.save(notification);
        }
        
        return dtoConverter.convertToCommentDTO(savedComment, user);
    }
    
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByProgressId(Long progressId, Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
        
        List<Comment> comments = commentRepository.findByLearningProgressOrderByCreatedAtAsc(progress);
        
        return comments.stream()
                .map(comment -> dtoConverter.convertToCommentDTO(comment, currentUser))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        LearningProgress progress = comment.getLearningProgress();
        
        // Check if user is the comment owner or progress owner
        if (!comment.getUser().getId().equals(userId) && !progress.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You are not authorized to delete this comment");
        }
        
        commentRepository.delete(comment);
    }
    @Transactional
    public CommentDTO updateComment(Long progressId, Long commentId, CommentDTO commentDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
                
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        // Verify the comment belongs to the specified progress
        if (!comment.getLearningProgress().getId().equals(progressId)) {
            throw new IllegalStateException("Comment does not belong to the specified learning progress");
        }
        
        // Check if user is the comment owner
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You are not authorized to edit this comment");
        }
        
        // Update comment content
        comment.setContent(commentDTO.getContent());
        Comment updatedComment = commentRepository.save(comment);
        
        return dtoConverter.convertToCommentDTO(updatedComment, user);
    }
}
