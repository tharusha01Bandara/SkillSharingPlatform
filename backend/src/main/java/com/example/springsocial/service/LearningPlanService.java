package com.example.springsocial.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springsocial.model.LearningPlan;
import com.example.springsocial.repository.LearningPlanRepository;

@Service
public class LearningPlanService {
    
    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public LearningPlan save(LearningPlan plan) {
        return learningPlanRepository.save(plan);
    }

    public List<LearningPlan> findAll() {
        return learningPlanRepository.findAll();
    }

    public LearningPlan findById(Long id) {
        return learningPlanRepository.findById(id).orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    public LearningPlan update(Long id, LearningPlan updatedPlan) {
        LearningPlan existing = findById(id);
        existing.setTitle(updatedPlan.getTitle());
        existing.setDescription(updatedPlan.getDescription());
        existing.setTopics(updatedPlan.getTopics());
        existing.setResources(updatedPlan.getResoueces());
        existing.setTimeline(updatedPlan.getTimeline());
        return learningPlanRepository.save(existing);
    }

    public void delete (Long id) {
        learningPlanRepository.deleteById(id);
    }
}
