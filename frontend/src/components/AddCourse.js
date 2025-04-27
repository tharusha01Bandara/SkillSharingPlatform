import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import "./AddCourse.css";

function AddCourse() {
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

      // 1. Upload video to Cloudinary
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

      // 2. Add videoUrl to formData
      const updatedFormData = {
        ...formData,
        videoUrl: videoUrl
      };

      // 3. Save course info
      const res = await axios.post(`${API_BASE_URL}/course`, updatedFormData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log(res.data);
      setNotification({ show: true, message: "Course and video uploaded successfully!", type: "success" });
      
      // Reset form
      setFormData({
        courseName: "",
        lecturerId: "",
        yearLevel: "",
        courseCode: "",
        description: "",
        enrollmentKey: "",
        videoUrl: ""
      });
      setVideoFile(null);
      setFileName("");
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
      
    } catch (error) {
      console.error("Error uploading course:", error);
      setNotification({ show: true, message: "Failed to upload course or video!", type: "error" });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-container">
      <div className="form-card">
        <h2 className="form-title">Add New Course</h2>
        
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="courseName">Course Name</label>
              <input 
                id="courseName"
                name="courseName"
                value={formData.courseName}
                placeholder="e.g. Introduction to Computer Science" 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="courseCode">Course Code</label>
              <input 
                id="courseCode"
                name="courseCode" 
                value={formData.courseCode}
                placeholder="e.g. CS101" 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lecturerId">Lecturer ID</label>
              <input 
                id="lecturerId"
                name="lecturerId" 
                value={formData.lecturerId}
                placeholder="e.g. PROF123" 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="yearLevel">Year Level</label>
              <select 
                id="yearLevel"
                name="yearLevel" 
                value={formData.yearLevel}
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Year Level</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="postgrad">Postgraduate</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              name="description" 
              value={formData.description}
              placeholder="Provide a detailed description of the course..." 
              onChange={handleInputChange} 
              rows="4"
              required 
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="enrollmentKey">Enrollment Key</label>
            <input 
              id="enrollmentKey"
              name="enrollmentKey" 
              value={formData.enrollmentKey}
              placeholder="Create a unique enrollment key for students" 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Course Video</label>
            <div className="file-upload-container">
              <label htmlFor="video-upload" className="file-upload-label">
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <span className="upload-text">
                  {fileName ? fileName : "Click to select video or drag and drop"}
                </span>
              </label>
              <input 
                type="file" 
                id="video-upload" 
                accept="video/*" 
                onChange={handleFileChange} 
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <div>
                <span className="spinner"></span>
                <span>Uploading...</span>
              </div>
            ) : (
              "Create Course"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;