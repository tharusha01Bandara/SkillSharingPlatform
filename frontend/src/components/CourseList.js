  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { API_BASE_URL } from "../constants"; // Adjust if needed

  function CourseList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
      axios.get(`${API_BASE_URL}/courses`)
        .then(res => setCourses(res.data))
        .catch(err => {
          console.error("Failed to fetch courses", err);
          alert("Error loading courses.");
        });
    }, []);

    return (
      <div>
        <h2>All Courses</h2>
        {courses.length === 0 && <p>No courses found.</p>}
        <div>
          {courses.map(course => (
            <div key={course.id} style={{ marginBottom: "30px" }}>
              <h3>{course.courseName}</h3>
              <p><strong>Code:</strong> {course.courseCode}</p>
              <p><strong>Lecturer:</strong> {course.lecturerId}</p>
              <p><strong>Year Level:</strong> {course.yearLevel}</p>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Enrollment Key:</strong> {course.enrollmentKey}</p>
              {course.videoUrl && (
                <video width="480" height="320" controls>
                  <source src={course.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default CourseList;
