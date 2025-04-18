import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { API_BASE_URL } from "../constants";

function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/courses`)
      .then(res => setCourses(res.data))
      .catch(err => {
        console.error("Failed to fetch courses", err);
        alert("Error loading courses.");
      });
  }, []);

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${API_BASE_URL}/courses/${id}`);
        setCourses(courses.filter(course => course.id !== id));
        alert("Course deleted successfully");
      } catch (error) {
        console.error("Failed to delete course", error);
        alert("Failed to delete course");
      }
    }
  };

  const handleUpdate = (course) => {
    setRedirect(<Redirect to={{ pathname: `/update-course/${course.id}`, state: course }} />);
  };

  return (
    <div>
      {redirect}
      <h2>All Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Lecturer</th>
              <th>Year Level</th>
              <th>Description</th>
              <th>Enrollment Key</th>
              <th>Video</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.courseName}</td>
                <td>{course.courseCode}</td>
                <td>{course.lecturerId}</td>
                <td>{course.yearLevel}</td>
                <td>{course.description}</td>
                <td>{course.enrollmentKey}</td>
                <td>
                  {course.videoUrl && (
                    <video width="200" controls>
                      <source src={course.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </td>
                <td>
                  <button onClick={() => handleUpdate(course)}>Update</button>
                  <button onClick={() => deleteCourse(course.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CourseTable;
