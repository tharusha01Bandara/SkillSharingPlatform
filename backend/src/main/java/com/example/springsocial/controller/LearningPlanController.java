package com.example.springsocial.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.springsocial.model.LearningPlan;
import com.example.springsocial.service.LearningPlanService;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/learning-plans")
public class LearningPlanController {
    
    @Autowired
    private LearningPlanService learningPlanService;

    // CREATE
    @PostMapping()
    public ResponseEntity<LearningPlan> createPlan(@RequestBody LearningPlan plan) {
        return ResponseEntity.ok(learningPlanService.save(plan));
    }

    //READ (get all)
    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllPlans() {
        return ResponseEntity.ok(learningPlanService.findAll());
    }

    //READ (get by id)
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(learningPlanService.findById(id));
    }

    //UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable Long id, @RequestBody LearningPlan updatedPlan) {
        return ResponseEntity.ok(learningPlanService.update(id, updatedPlan));
    }

    //DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        learningPlanService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
