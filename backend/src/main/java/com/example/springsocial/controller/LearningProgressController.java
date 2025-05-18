package com.example.springsocial.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springsocial.dto.CommentDTO;
import com.example.springsocial.dto.LearningProgressDTO;
import com.example.springsocial.service.CommentService;
import com.example.springsocial.service.LearningProgressService;
import com.example.springsocial.service.UserService;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin("http://localhost:3000")
public class LearningProgressController {
    
    @Autowired
    private LearningProgressService progressService;
    
    @Autowired
    private CommentService commentService;
    
    @Autowired
    private UserService userService;
    
   
    @PostMapping
public ResponseEntity<?> createProgress(@RequestBody LearningProgressDTO progressDTO) {
    Long userId = 1L;
    try {
        LearningProgressDTO createdProgress = progressService.createProgress(progressDTO, userId);
        return new ResponseEntity<>(createdProgress, HttpStatus.CREATED);
    } catch (Exception e) {
        e.printStackTrace(); // Or use a logger
        return new ResponseEntity<>("Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    
    @GetMapping
    public ResponseEntity<List<LearningProgressDTO>> getAllProgress(
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        List<LearningProgressDTO> progressList = progressService.getAllProgress(userId);
        return new ResponseEntity<>(progressList, HttpStatus.OK);
    }
    
    @GetMapping("/{progressId}")
    public ResponseEntity<LearningProgressDTO> getProgressById(
            @PathVariable Long progressId
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        LearningProgressDTO progress = progressService.getProgressById(progressId, userId);
        return new ResponseEntity<>(progress, HttpStatus.OK);
    }
    
    @PutMapping("/{progressId}")
    public ResponseEntity<LearningProgressDTO> updateProgress(
            @PathVariable Long progressId,
            @RequestBody LearningProgressDTO progressDTO
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        LearningProgressDTO updatedProgress = progressService.updateProgress(progressId, progressDTO, userId);
        return new ResponseEntity<>(updatedProgress, HttpStatus.OK);
    }
    
    @DeleteMapping("/{progressId}")
    public ResponseEntity<Void> deleteProgress(
            @PathVariable Long progressId
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        progressService.deleteProgress(progressId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PostMapping("/{progressId}/like")
    public ResponseEntity<LearningProgressDTO> likeProgress(
            @PathVariable Long progressId
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        LearningProgressDTO progress = progressService.likeProgress(progressId, userId);
        return new ResponseEntity<>(progress, HttpStatus.OK);
    }
    
    @DeleteMapping("/{progressId}/like")
    public ResponseEntity<LearningProgressDTO> unlikeProgress(
            @PathVariable Long progressId
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        LearningProgressDTO progress = progressService.unlikeProgress(progressId, userId);
        return new ResponseEntity<>(progress, HttpStatus.OK);
    }
    
    @PostMapping("/{progressId}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long progressId,
            @RequestBody CommentDTO commentDTO
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        CommentDTO createdComment = commentService.addComment(progressId, commentDTO, userId);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }
    
    @GetMapping("/{progressId}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(
            @PathVariable Long progressId
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        List<CommentDTO> comments = commentService.getCommentsByProgressId(progressId, userId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    // New endpoint to edit a comment
    @PutMapping("/{progressId}/comments/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long progressId,
            @PathVariable Long commentId,
            @RequestBody CommentDTO commentDTO
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        CommentDTO updatedComment = commentService.updateComment(progressId, commentId, commentDTO, userId);
        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
    }
    
    // New endpoint to delete a comment
    @DeleteMapping("/{progressId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long progressId,
            @PathVariable Long commentId
            /*@AuthenticationPrincipal UserDetails userDetails*/) {
        
        Long userId = 1L;
        commentService.deleteComment(commentId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
