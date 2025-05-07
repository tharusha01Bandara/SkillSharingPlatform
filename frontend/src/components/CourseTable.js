import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import "./CourseTable.css";

function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "courseName", direction: "ascending" });
  const [expandedRow, setExpandedRow] = useState(null);

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

  const deleteCourse = async (id, event) => {
    event.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/courses/${id}`);
        setCourses(courses.filter(course => course.id !== id));
        
        // Show success notification
        const notification = document.getElementById("notification");
        notification.innerText = "Course deleted successfully";
        notification.className = "notification show success";
        
        setTimeout(() => {
          notification.className = "notification";
        }, 3000);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to delete course", error);
        
        // Show error notification
        const notification = document.getElementById("notification");
        notification.innerText = "Failed to delete course";
        notification.className = "notification show error";
        
        setTimeout(() => {
          notification.className = "notification";
        }, 3000);
        
        setLoading(false);
      }
    }
  };

  const handleUpdate = (course, event) => {
    event.stopPropagation();
    setRedirect(<Redirect to={{ pathname: `/update-course/${course.id}`, state: course }} />);
  };

  const sortedCourses = React.useMemo(() => {
    let sortableCourses = [...courses];
    if (sortConfig.key) {
      sortableCourses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCourses;
  }, [courses, sortConfig]);

  const filteredCourses = sortedCourses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  const toggleRowExpand = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  return (
    <div className="course-table-container">
      {redirect}
      
      <div className="table-header">
        <h1>Course Management</h1>
        <div className="table-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zm0 0L16 22" />
            </svg>
          </div>
          <button className="add-course-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Course
          </button>
        </div>
      </div>

      <div className="notification" id="notification"></div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="no-data">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>No courses found matching your search.</p>
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="courses-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => requestSort("courseName")}>
                  Course Name {getSortIndicator("courseName")}
                </th>
                <th className="sortable" onClick={() => requestSort("courseCode")}>
                  Code {getSortIndicator("courseCode")}
                </th>
                <th className="sortable" onClick={() => requestSort("lecturerId")}>
                  Lecturer {getSortIndicator("lecturerId")}
                </th>
                <th className="sortable" onClick={() => requestSort("yearLevel")}>
                  Year {getSortIndicator("yearLevel")}
                </th>
                <th className="enrollment-key-col">Enrollment Key</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <React.Fragment key={course.id}>
                  <tr 
                    className={expandedRow === course.id ? "expanded" : ""} 
                    onClick={() => toggleRowExpand(course.id)}
                  >
                    <td className="course-name">
                      <div>
                        <span className="primary-text">{course.courseName}</span>
                        <span className="row-expander">
                          {expandedRow === course.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="course-code">
                      <span className="code-badge">{course.courseCode}</span>
                    </td>
                    <td className="lecturer">{course.lecturerId}</td>
                    <td className="year-level">
                      <span className="year-badge">{course.yearLevel}</span>
                    </td>
                    <td className="enrollment-key">
                      <div className="key-container">
                        <code>{course.enrollmentKey}</code>
                        <button className="copy-btn" onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(course.enrollmentKey);
                          alert("Enrollment key copied!");
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="actions">
                      <button 
                        className="courseedit-btn" 
                        onClick={(e) => handleUpdate(course, e)}
                        aria-label="Edit course"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="coursedelete-btn" 
                        onClick={(e) => deleteCourse(course.id, e)}
                        aria-label="Delete course"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {expandedRow === course.id && (
                    <tr className="detail-row">
                      <td colSpan="6">
                        <div className="course-details">
                          <div className="description-section">
                            <h3>Description</h3>
                            <p>{course.description}</p>
                          </div>
                          
                          {course.videoUrl && (
                            <div className="video-section">
                              <h3>Course Preview</h3>
                              <video controls className="course-video">
                                <source src={course.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="table-footer">
        <p>Showing {filteredCourses.length} of {courses.length} courses</p>
      </div>
    </div>
  );
}

export default CourseTable;