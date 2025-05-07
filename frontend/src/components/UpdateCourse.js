import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../constants";
import "./UpdateCourse.css";

function UpdateCourse() {
  const location = useLocation();
  const history = useHistory();
  const course = location.state;
  const [formData, setFormData] = useState({ ...course });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/courses/${course.id}`, formData);
      setLoading(false);

      // SweetAlert2 confirmation
      Swal.fire({
        title: "Success!",
        text: "Course updated successfully!",
        icon: "success",
        confirmButtonText: "Go to Course Table",
        confirmButtonColor: "#1eb2a6",
      }).then(() => {
        history.push("/coursesTable");
      });

    } catch (error) {
      setLoading(false);
      console.error("Update failed", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update course.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleCancel = () => {
    history.push("/coursesTable");
  };

  return (
    <div className="update-course-container">
      <div className="update-course-wrapper glass-card">
        <div className="update-course-header">
          <h2>📘 Update Course</h2>
          <p>Modify the details below and hit <strong>Update</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="update-course-form">
          <div className="form-row">
            <div className="form-group">
              <label>Course Name</label>
              <input name="courseName" value={formData.courseName} onChange={handleInputChange} placeholder="Course name" required />
            </div>
            <div className="form-group">
              <label>Course Code</label>
              <input name="courseCode" value={formData.courseCode} onChange={handleInputChange} placeholder="Course code" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Lecturer ID</label>
              <input name="lecturerId" value={formData.lecturerId} onChange={handleInputChange} placeholder="Lecturer ID" required />
            </div>
            <div className="form-group">
              <label>Year Level</label>
              <input name="yearLevel" value={formData.yearLevel} onChange={handleInputChange} placeholder="Year level" required />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Course description" rows="4" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Enrollment Key</label>
              <input name="enrollmentKey" value={formData.enrollmentKey} onChange={handleInputChange} placeholder="Enrollment key" required />
            </div>
            <div className="form-group">
              <label>Video URL</label>
              <input name="videoUrl" type="url" value={formData.videoUrl} onChange={handleInputChange} placeholder="Video URL" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="btn update" disabled={loading}>
              {loading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;
