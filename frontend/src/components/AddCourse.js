import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants"; // adjust import if needed

function AddCourse() {
  const [formData, setFormData] = useState({
    courseName: "",
    lecturerId: "",
    yearLevel: "",
    courseCode: "",
    description: "",
    enrollmentKey: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/course`, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log(res.data);
      alert("Course uploaded successfully!");
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("Failed to upload course!");
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}


export default AddCourse;
