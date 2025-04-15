import React, { useState } from "react";
import axios from "axios";

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

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = e => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let videoUrl = "";

      if (videoFile) {
        const uploadData = new FormData();
        uploadData.append("file", videoFile);

        const uploadRes = await axios.post("http://localhost:8080/course/uploadVideo", uploadData);
        videoUrl = uploadRes.data;
      }

      const courseData = { ...formData, videoUrl };

      await axios.post("http://localhost:8080/course", courseData);

      alert("Course uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  };

  return (
    <div>
      <h2>Add Course</h2>
      <form onSubmit={handleSubmit}>
        <input name="courseName" placeholder="Course Name" onChange={handleInputChange} />
        <input name="lecturerId" placeholder="Lecturer Id" onChange={handleInputChange} />
        <input name="yearLevel" placeholder="Year Level" onChange={handleInputChange} />
        <input name="courseCode" placeholder="Course Code" onChange={handleInputChange} />
        <input name="description" placeholder="Description" onChange={handleInputChange} />
        <input name="enrollmentKey" placeholder="Enrollment Key" onChange={handleInputChange} />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddCourse;
