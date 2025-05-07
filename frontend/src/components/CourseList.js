import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import "./CourseList.css";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/courses`)
      .then(res => {
        setCourses(res.data);
        const initialLikes = {};
        const initialComments = {};
        res.data.forEach(course => {
          initialLikes[course.id] = 0;
          initialComments[course.id] = [];
        });
        setLikes(initialLikes);
        setComments(initialComments);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch courses", err);
        alert("Error loading courses.");
        setLoading(false);
      });
  }, []);

  const handleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleComment = (id, comment) => {
    if (!comment.trim()) return;
    setComments(prev => ({ ...prev, [id]: [...prev[id], comment] }));
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "all" || course.yearLevel.toString() === filter;
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
      ) : (
        <div className="course-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-card-header" style={{ backgroundColor: getRandomColor(course.id) }}>
                <span className="course-code">{course.courseCode}</span>
                <span className="course-year">Year {course.yearLevel}</span>
              </div>

              <div className="course-card-body">
                <h3 className="course-title">{course.courseName}</h3>
                <p className="course-lecturer">Prof. {course.lecturerId}</p>
                <p className="course-description">{course.description}</p>
                <p className="course-enrollment">Enrollment Key: {course.enrollmentKey}</p>
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

              <div className="interaction-section">
                <div className="like-section">
                  <button onClick={() => handleLike(course.id)} className="like-button">👍 {likes[course.id]}</button>
                  
                </div>
                <div className="comment-section">
                  <input
                    type="text"
                    placeholder="Add a comment"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleComment(course.id, e.target.value);
                    }}
                  />
                  <div className="comment-list">
                  {(comments[course.id] || []).map((c, i) => (
  <div key={i} className="comment-item">💬 {c}</div>
))}

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getRandomColor(id) {
  const colors = [
    '#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#1abc9c',
    '#f39c12', '#d35400', '#c0392b', '#16a085', '#8e44ad'
  ];
  const colorIndex = parseInt(id.toString().split('').reduce((a, b) => a + parseInt(b), 0)) % colors.length;
  return colors[colorIndex];
}

export default CourseList;
