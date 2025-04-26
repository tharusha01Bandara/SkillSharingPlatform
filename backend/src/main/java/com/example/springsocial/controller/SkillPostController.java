package com.example.springsocial.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.springsocial.model.SkillPost;
import com.example.springsocial.repository.SkillPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
}
