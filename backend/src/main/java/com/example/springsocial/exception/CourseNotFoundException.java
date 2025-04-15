package com.example.springsocial.exception;

public class CourseNotFoundException extends RuntimeException {

    public CourseNotFoundException(Long id) {
        super("Could not find course with ID " + id);
    }

    public CourseNotFoundException(String message) {
        super(message);
    }
}
