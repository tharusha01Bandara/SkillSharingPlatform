package com.example.springsocial.util;

import org.springframework.stereotype.Component;

import com.example.springsocial.dto.CommentDTO;
import com.example.springsocial.dto.LearningProgressDTO;
import com.example.springsocial.dto.NotificationDTO;
import com.example.springsocial.dto.UserDTO;
import com.example.springsocial.model.Comment;
import com.example.springsocial.model.LearningProgress;
import com.example.springsocial.model.Notification;
import com.example.springsocial.model.User;

@Component
public class DtoConverter {
    
    public UserDTO convertToUserDTO(User user, User currentUser) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        //userDTO.setFullName(user.getFullName());
        //userDTO.setBio(user.getBio());
        userDTO.setImageUrl(user.getImageUrl());
        userDTO.setFollowerCount(user.getFollowers().size());
        userDTO.setFollowingCount(user.getFollowing().size());
        
        // Check if current user is following this user
        if (currentUser != null) {
            userDTO.setCurrentUserFollowing(
                user.getFollowers().stream()
                    .anyMatch(follower -> follower.getId().equals(currentUser.getId()))
            );
        }
        
        return userDTO;
    }
    
    public LearningProgressDTO convertToLearningProgressDTO(LearningProgress progress, User currentUser) {
        LearningProgressDTO progressDTO = new LearningProgressDTO();
        progressDTO.setId(progress.getId());
        progressDTO.setTitle(progress.getTitle());
        progressDTO.setContent(progress.getContent());
        progressDTO.setTutorialCompleted(progress.getTutorialCompleted());
        progressDTO.setSkillsLearned(progress.getSkillsLearned());
        progressDTO.setCreatedAt(progress.getCreatedAt());
        progressDTO.setUpdatedAt(progress.getUpdatedAt());
        
        // Set user info
        progressDTO.setUser(convertToUserDTO(progress.getUser(), currentUser));
        
        // Set comment and like counts
        progressDTO.setCommentCount(progress.getComments().size());
        progressDTO.setLikeCount(progress.getLikes().size());
        
        // Check if current user liked this progress
        if (currentUser != null) {
            progressDTO.setCurrentUserLiked(
                progress.getLikes().stream()
                    .anyMatch(user -> user.getId().equals(currentUser.getId()))
            );
        }
        
        return progressDTO;
    }
    
    public CommentDTO convertToCommentDTO(Comment comment, User currentUser) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setContent(comment.getContent());
        commentDTO.setCreatedAt(comment.getCreatedAt());
        
        // Set user info
        commentDTO.setUser(convertToUserDTO(comment.getUser(), currentUser));
        
        // Set like count
        commentDTO.setLikeCount(comment.getLikes().size());
        
        // Check if current user liked this comment
        if (currentUser != null) {
            commentDTO.setCurrentUserLiked(
                comment.getLikes().stream()
                    .anyMatch(user -> user.getId().equals(currentUser.getId()))
            );
        }
        
        return commentDTO;
    }
    
    public NotificationDTO convertToNotificationDTO(Notification notification) {
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setType(notification.getType());
        notificationDTO.setMessage(notification.getMessage());
        notificationDTO.setIsRead(notification.isRead());
        notificationDTO.setCreatedAt(notification.getCreatedAt());
        
        // Set actor info
        notificationDTO.setActor(convertToUserDTO(notification.getActor(), null));
        
        // Set progress ID if available
        if (notification.getLearningProgress() != null) {
            notificationDTO.setProgressId(notification.getLearningProgress().getId());
        }
        
        return notificationDTO;
    }
}
