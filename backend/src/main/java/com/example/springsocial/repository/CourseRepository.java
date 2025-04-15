package com.example.springsocial.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.springsocial.model.CourseModel;



public interface CourseRepository extends JpaRepository<CourseModel,Long>{

}
