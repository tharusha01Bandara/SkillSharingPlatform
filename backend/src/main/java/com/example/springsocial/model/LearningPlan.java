package com.example.springsocial.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "learning_plans")

public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Title")
    private String title;

    @Column(name = "Description")
    private String description;

    @Column(name = "Topics")
    private String topics;

    @Column(name = "Resources")
    private String resources;

    @Column(name = "Time_line")
    private String timeline;

    // @ManyToOne
    // @JoinColumn(name = "user_id")

// private User users;

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public String getTitle() {
    return title;
}

public void setTitle(String title) {
    this.title = title;
}

public String getDescription() {
    return description;
}

public void setDescription(String description) {
    this.description = description;
}

public String getTopics() {
    return topics;
}

public void setTopics(String topics) {
    this.topics = topics;
}

public String getResoueces() {
    return resources;
}

public void setResources(String resources) {
    this.resources = resources;
}

public String getTimeline() {
    return timeline;
}

public void setTimeline(String timeline) {
    this.timeline = timeline;
}
    
}
