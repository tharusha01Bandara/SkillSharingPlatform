import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../constants";

function UpdateCourse() {
  const location = useLocation();
  const course = location.state;
  const [formData, setFormData] = useState({ ...course });
  const [redirect, setRedirect] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/courses/${course.id}`, formData);
      alert("Course updated successfully!");
      setRedirect(true);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update course.");
    }
  };

  if (redirect) {
    window.location.href = "/coursesTable";
    return null;
  }

  return (
    <div>
      <h2>Update Course</h2>
      <form onSubmit={handleSubmit}>
        <input name="courseName" value={formData.courseName} onChange={handleInputChange} placeholder="Course Name" />
        <input name="courseCode" value={formData.courseCode} onChange={handleInputChange} placeholder="Course Code" />
        <input name="lecturerId" value={formData.lecturerId} onChange={handleInputChange} placeholder="Lecturer ID" />
        <input name="yearLevel" value={formData.yearLevel} onChange={handleInputChange} placeholder="Year Level" />
        <input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
        <input name="enrollmentKey" value={formData.enrollmentKey} onChange={handleInputChange} placeholder="Enrollment Key" />
        <input name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="Video URL" />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateCourse;