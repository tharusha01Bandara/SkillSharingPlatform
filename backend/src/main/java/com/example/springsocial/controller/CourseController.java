package com.example.springsocial.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.springsocial.model.CourseModel;
import com.example.springsocial.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private Cloudinary cloudinary;

    // Upload course video to Cloudinary and return the video URL
    @PostMapping("/course/uploadVideo")
    public String uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "video"));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading video";
        }
    }

    // Save course data (with video URL included)
    @PostMapping("/course")
    public CourseModel newCourseModel(@RequestBody CourseModel newCourseModel) {
        return courseRepository.save(newCourseModel);
    }

    // Fetch all courses
    @GetMapping("/courses")
    public List<CourseModel> getAllCourses() {
        return courseRepository.findAll();
    }

    // Update existing course
    @PutMapping("/courses/{id}")
    public CourseModel updateCourse(@PathVariable Long id, @RequestBody CourseModel updatedCourse) {
        CourseModel course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + id));

        course.setCourseName(updatedCourse.getCourseName());
        course.setCourseCode(updatedCourse.getCourseCode());
        course.setLecturerId(updatedCourse.getLecturerId());
        course.setYearLevel(updatedCourse.getYearLevel());
        course.setDescription(updatedCourse.getDescription());
        course.setEnrollmentKey(updatedCourse.getEnrollmentKey());
        course.setVideoUrl(updatedCourse.getVideoUrl());

        return courseRepository.save(course);
    }

    // Delete a course
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        courseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
