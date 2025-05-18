import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import "./AddCourse.css";

function AddCourse() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    courseName: "",
    lecturerId: "",
    yearLevel: "",
    courseCode: "",
    description: "",
    enrollmentKey: "",
    videoUrl: ""
  });

  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [fileName, setFileName] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let videoUrl = "";

      if (videoFile) {
        const videoForm = new FormData();
        videoForm.append("file", videoFile);
        videoForm.append("upload_preset", "ml_default");
        videoForm.append("resource_type", "video");

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dwqt9tifr/video/upload`,
          videoForm
        );

        videoUrl = uploadRes.data.secure_url;
      }

      const updatedFormData = {
        ...formData,
        videoUrl: videoUrl
      };

      await axios.post(`${API_BASE_URL}/course`, updatedFormData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      setNotification({ show: true, message: "Course and video uploaded successfully!", type: "success" });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        history.push("/courses"); // 👈 Redirect to /courses
      }, 2000);

    } catch (error) {
      setNotification({ show: true, message: "Failed to upload course or video!", type: "error" });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-unique-container">
      <div className="unique-form-card">
        <h2 className="unique-form-title">📘 Add Course</h2>
        <p className="unique-form-subtitle">Provide details to list your course</p>

        {notification.show && (
          <div className={`unique-notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="unique-form-grid">
            <div className="unique-form-group">
              <label htmlFor="courseName">Course Name</label>
              <input id="courseName" name="courseName" value={formData.courseName} onChange={handleInputChange} required />
            </div>
            <div className="unique-form-group">
              <label htmlFor="courseCode">Course Code</label>
              <input id="courseCode" name="courseCode" value={formData.courseCode} onChange={handleInputChange} required />
            </div>
            <div className="unique-form-group">
              <label htmlFor="lecturerId">Lecturer ID</label>
              <input id="lecturerId" name="lecturerId" value={formData.lecturerId} onChange={handleInputChange} required />
            </div>
            <div className="unique-form-group">
              <label htmlFor="yearLevel">Year Level</label>
              <select id="yearLevel" name="yearLevel" value={formData.yearLevel} onChange={handleInputChange} required>
                <option value="">Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="postgrad">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="unique-form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="4" required />
          </div>

          <div className="unique-form-group">
            <label htmlFor="enrollmentKey">Enrollment Key</label>
            <input id="enrollmentKey" name="enrollmentKey" value={formData.enrollmentKey} onChange={handleInputChange} required />
          </div>

          <div className="unique-form-group">
            <label>Course Video</label>
            <div className="unique-file-upload">
              <label htmlFor="video-upload" className="upload-label">
                <span className="upload-icon">📤</span>
                <span className="upload-text">{fileName || "Upload video"}</span>
              </label>
              <input type="file" id="video-upload" accept="video/*" onChange={handleFileChange} required />
            </div>
          </div>

          <button type="submit" className="unique-submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
