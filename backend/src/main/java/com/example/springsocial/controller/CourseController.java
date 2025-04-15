package com.example.springsocial.controller;

import com.example.springsocial.model.CourseModel;
import com.example.springsocial.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@RestController
@CrossOrigin("http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // Save course data
    @PostMapping("/course")
    public CourseModel newCourseModel(@RequestBody CourseModel newCourseModel) {
        return courseRepository.save(newCourseModel);
    }

    // Upload course video
    @PostMapping("/course/uploadVideo")
    public String uploadVideo(@RequestParam("file") MultipartFile file) {
        String folder = "src/main/uploads/";
        String videoName = file.getOriginalFilename();

        try {
            File uploadDir = new File(folder);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs(); // creates folder if not exists
            }

            file.transferTo(Paths.get(folder + videoName));
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading video: " + videoName;
        }

        return videoName;
    }
}
