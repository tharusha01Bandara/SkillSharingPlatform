package com.example.springsocial.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springsocial.dto.LearningProgressDTO;
import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.LearningProgress;
import com.example.springsocial.model.Notification;
import com.example.springsocial.model.User;
import com.example.springsocial.repository.LearningProgressRepository;
import com.example.springsocial.repository.NotificationRepository;
import com.example.springsocial.repository.UserRepository;
import com.example.springsocial.util.DtoConverter;

@Service
public class LearningProgressService {
    
    @Autowired
    private LearningProgressRepository progressRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private DtoConverter dtoConverter;
    
    @Transactional
    public LearningProgressDTO createProgress(LearningProgressDTO progressDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LearningProgress progress = new LearningProgress();
        progress.setTitle(progressDTO.getTitle());
        progress.setContent(progressDTO.getContent());
        progress.setTutorialCompleted(progressDTO.getTutorialCompleted());
        progress.setSkillsLearned(progressDTO.getSkillsLearned());
        progress.setUser(user);
        
        LearningProgress savedProgress = progressRepository.save(progress);
        
        // Create notifications for user's followers
        for (User follower : user.getFollowers()) {
            Notification notification = new Notification();
            notification.setType("PROGRESS_UPDATE");
            notification.setMessage(user.getName() + " posted a new learning progress update");
            notification.setRecipient(follower);
            notification.setActor(user);
            notification.setLearningProgress(savedProgress);
            notificationRepository.save(notification);
        }
        
        return dtoConverter.convertToLearningProgressDTO(savedProgress, user);
    }
    
    @Transactional(readOnly = true)
    public List<LearningProgressDTO> getAllProgress(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<LearningProgress> progressList = progressRepository.findAllByOrderByCreatedAtDesc();
        
        return progressList.stream()
                .map(progress -> dtoConverter.convertToLearningProgressDTO(progress, currentUser))
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public LearningProgressDTO getProgressById(Long progressId, Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
        
        return dtoConverter.convertToLearningProgressDTO(progress, currentUser);
    }
    
    @Transactional
    public LearningProgressDTO updateProgress(Long progressId, LearningProgressDTO progressDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
        
        // Check if the user is the owner of the progress
        if (!progress.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You are not authorized to update this progress");
        }
        
        progress.setTitle(progressDTO.getTitle());
        progress.setContent(progressDTO.getContent());
        progress.setTutorialCompleted(progressDTO.getTutorialCompleted());
        progress.setSkillsLearned(progressDTO.getSkillsLearned());
        
        LearningProgress updatedProgress = progressRepository.save(progress);
        
        // Create notifications for user's followers
        for (User follower : user.getFollowers()) {
            Notification notification = new Notification();
            notification.setType("PROGRESS_UPDATE");
            notification.setMessage(user.getName() + " updated their learning progress");
            notification.setRecipient(follower);
            notification.setActor(user);
            notification.setLearningProgress(updatedProgress);
            notificationRepository.save(notification);
        }
        
        return dtoConverter.convertToLearningProgressDTO(updatedProgress, user);
    }
    
    @Transactional
    public void deleteProgress(Long progressId, Long userId) {
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
        
        // Check if the user is the owner of the progress
        if (!progress.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You are not authorized to delete this progress");
        }
        
        User user = progress.getUser();
        
        // Create notifications about the deletion for user's followers
        for (User follower : user.getFollowers()) {
            Notification notification = new Notification();
            notification.setType("PROGRESS_DELETE");
            notification.setMessage(user.getName() + " deleted a learning progress update");
            notification.setRecipient(follower);
            notification.setActor(user);
            notificationRepository.save(notification);
        }
        
        progressRepository.delete(progress);
    }
    
    @Transactional
    public LearningProgressDTO likeProgress(Long progressId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
        
        // Check if user already liked the progress
        if (progress.getLikes().stream().noneMatch(u -> u.getId().equals(userId))) {
            progress.getLikes().add(user);
            progress = progressRepository.save(progress);
            
            // Create notification for progress owner
            if (!progress.getUser().getId().equals(userId)) {
                Notification notification = new Notification();
                notification.setType("LIKE");
                notification.setMessage(user.getName() + " liked your learning progress update");
                notification.setRecipient(progress.getUser());
                notification.setActor(user);
                notification.setLearningProgress(progress);
                notificationRepository.save(notification);
            }
        }
        
        return dtoConverter.convertToLearningProgressDTO(progress, user);
    }
    
    @Transactional
    public LearningProgressDTO unlikeProgress(Long progressId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LearningProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning progress not found"));
        
        progress.getLikes().removeIf(u -> u.getId().equals(userId));
        progress = progressRepository.save(progress);
        
        return dtoConverter.convertToLearningProgressDTO(progress, user);
    }
}
