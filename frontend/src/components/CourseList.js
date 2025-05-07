
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import "./CourseList.css"; // We'll create this file next

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/courses`)
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch courses", err);
        alert("Error loading courses.");
        setLoading(false);
      });
  }, []);

  // Filter courses based on year level and search term
  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "all" || course.yearLevel.toString() === filter;
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get unique year levels for filter options
  const yearLevels = [...new Set(courses.map(course => course.yearLevel))].sort();

  return (
    <div className="course-list-container">
      <div className="course-header">
        <div className="course-header-text">
          <h1>Explore Our Courses</h1>
          <p>Discover a wide range of courses designed to help you achieve your academic goals</p>
        </div>
        
        <div className="course-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/>
            </svg>
          </div>
          
          <div className="filter-container">
            <label htmlFor="year-filter">Filter by Year:</label>
            <select 
              id="year-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Years</option>
              {yearLevels.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="no-courses">
          <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/>
          </svg>
          <p>No courses found matching your criteria.</p>
          <button 
            className="reset-button"
            onClick={() => {
              setFilter("all");
              setSearchTerm("");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-card-header" style={{ 
                backgroundColor: getRandomColor(course.id) 
              }}>
                <span className="course-code">{course.courseCode}</span>
                <span className="course-year">Year {course.yearLevel}</span>
              </div>
              
              <div className="course-card-body">
                <h3 className="course-title">{course.courseName}</h3>
                <p className="course-lecturer">
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"/>
                  </svg>
                  Prof. {course.lecturerId}
                </p>
                
                <div className="course-description">
                  <p>{course.description}</p>
                </div>
                
                <div className="course-enrollment">
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M18 8h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2V7a6 6 0 1 1 12 0v1zm-2 0V7a4 4 0 1 0-8 0v1h8zm-5 6v2h2v-2h-2zm-4 0v2h2v-2H7zm8 0v2h2v-2h-2z"/>
                  </svg>
                  <span className="enrollment-key">{course.enrollmentKey}</span>
                </div>
              </div>
              
              {course.videoUrl && (
                <div className="course-video">
                  <video controls>
                    <source src={course.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              
              <div className="course-card-footer">
                <button className="enroll-button">Enroll Now</button>
                <button className="details-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to generate consistent colors based on course ID
function getRandomColor(id) {
  const colors = [
    '#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#1abc9c',
    '#f39c12', '#d35400', '#c0392b', '#16a085', '#8e44ad'
  ];
  
  // Use the course ID to select a color
  const colorIndex = parseInt(id.toString().split('').reduce((a, b) => a + parseInt(b), 0)) % colors.length;
  return colors[colorIndex];
}

export default CourseList;
