import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let videoUrl = "";

      // 1. Upload video to Cloudinary
      if (videoFile) {
        const videoForm = new FormData();
        videoForm.append("file", videoFile);
        videoForm.append("upload_preset", "ml_default"); // You may need to change this preset
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
      alert("Course and video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Failed to upload course or video!");
    }
  };

  return (
    <div>
      <h2>Add Course</h2>
      <form onSubmit={handleSubmit}>
        <input name="courseName" placeholder="Course Name" onChange={handleInputChange} required />
        <input name="lecturerId" placeholder="Lecturer Id" onChange={handleInputChange} required />
        <input name="yearLevel" placeholder="Year Level" onChange={handleInputChange} required />
        <input name="courseCode" placeholder="Course Code" onChange={handleInputChange} required />
        <input name="description" placeholder="Description" onChange={handleInputChange} required />
        <input name="enrollmentKey" placeholder="Enrollment Key" onChange={handleInputChange} required />

        <input type="file" accept="video/*" onChange={handleFileChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddCourse;
