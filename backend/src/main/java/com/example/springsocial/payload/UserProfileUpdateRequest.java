package com.example.springsocial.payload;

public class UserProfileUpdateRequest {
    private String name;
    private String bio;
    private String skills;
    private String interests;
    private String location;
    private String profession;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }
}
