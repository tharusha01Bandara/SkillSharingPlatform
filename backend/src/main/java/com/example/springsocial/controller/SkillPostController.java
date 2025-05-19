package com.example.springsocial.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.springsocial.model.SkillPost;
import com.example.springsocial.model.User;
import com.example.springsocial.repository.SkillPostRepository;
import com.example.springsocial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class SkillPostController {

    @Autowired
    private SkillPostRepository skillPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    // Upload image/video to Cloudinary and return the URL
    @PostMapping("/skillpost/uploadMedia")
    public String uploadMedia(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", file.getContentType().startsWith("image") ? "image" : "video"));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading media";
        }
    }

    // Save a new skill post
    @PostMapping("/skillposts")
    public SkillPost newSkillPost(@RequestBody SkillPost newSkillPost) {
        newSkillPost.setCreatedAt(java.time.LocalDateTime.now());
        return skillPostRepository.save(newSkillPost);
    }

    // Fetch all skill posts
    @GetMapping("/skillposts")
    public List<SkillPost> getAllSkillPosts() {
        return skillPostRepository.findAll();
    }

    // GET mapping to fetch a single skill post by ID
    @GetMapping("/skillposts/{id}")
    public ResponseEntity<SkillPost> getSkillPostById(@PathVariable Long id) {
        return skillPostRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // // Fetch a single skill post by ID
    // @GetMapping("/skillposts/{id}")
    // public ResponseEntity<SkillPost> getSkillPostById(@PathVariable Long id) {
    //     System.out.println("Fetching skill post with ID: " + id);
    //     return skillPostRepository.findById(id)
    //             .map(post -> {
    //                 System.out.println("Found post: " + post.getTitle());
    //                 return ResponseEntity.ok(post);
    //             })
    //             .orElseGet(() -> {
    //                 System.out.println("No post found with ID: " + id);
    //                 return ResponseEntity.notFound().build();
    //             });
    // }

    // Update an existing skill post
    @PutMapping("/skillposts/{id}")
    public SkillPost updateSkillPost(@PathVariable Long id, @RequestBody SkillPost updatedSkillPost) {
        SkillPost skillPost = skillPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SkillPost not found with id " + id));

        skillPost.setTitle(updatedSkillPost.getTitle());
        skillPost.setDescription(updatedSkillPost.getDescription());
        skillPost.setImageUrls(updatedSkillPost.getImageUrls());
        skillPost.setUpdatedAt(java.time.LocalDateTime.now());

        return skillPostRepository.save(skillPost);
    }

    // Delete a skill post
    @DeleteMapping("/skillposts/{id}")
    public ResponseEntity<?> deleteSkillPost(@PathVariable Long id) {
        if (!skillPostRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        skillPostRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Like a skill post
    @PostMapping("/skillposts/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SkillPost not found with id " + id));

        if (post.isLikedBy(currentUser)) {
            return ResponseEntity.badRequest().body("Post already liked by user");
        }

        post.addLike(currentUser);
        skillPostRepository.save(post);

        return ResponseEntity.ok(Map.of(
            "liked", true,
            "likesCount", post.getLikesCount()
        ));
    }

    // Unlike a skill post
    @DeleteMapping("/skillposts/{id}/like")
    public ResponseEntity<?> unlikePost(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SkillPost not found with id " + id));

        if (!post.isLikedBy(currentUser)) {
            return ResponseEntity.badRequest().body("Post not liked by user");
        }

        post.removeLike(currentUser);
        skillPostRepository.save(post);

        return ResponseEntity.ok(Map.of(
            "liked", false,
            "likesCount", post.getLikesCount()
        ));
    }

    // Get like status for a post
    @GetMapping("/skillposts/{id}/like")
    public ResponseEntity<?> getLikeStatus(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SkillPost not found with id " + id));

        return ResponseEntity.ok(Map.of(
            "liked", post.isLikedBy(currentUser),
            "likesCount", post.getLikesCount()
        ));
    }
}
