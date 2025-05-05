import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";  // Make sure API_BASE_URL is correct

function AddSkillPost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrls: ""
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files)); // multiple images
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let uploadedImageUrls = [];

      // 1. Upload all selected images to Cloudinary (optional)
      if (imageFiles.length > 0) {
        for (let image of imageFiles) {
          const imageForm = new FormData();
          imageForm.append("file", image);
          imageForm.append("upload_preset", "ml_default"); // Change if needed
          
          const uploadRes = await axios.post(
            `https://api.cloudinary.com/v1_1/dwqt9tifr/image/upload`,
            imageForm
          );
          
          uploadedImageUrls.push(uploadRes.data.secure_url);
        }
      }

      // 2. Update form data
      const updatedFormData = {
        ...formData,
        imageUrls: uploadedImageUrls.join(",") // Save as comma-separated URLs
      };

      // 3. Save skill post to backend
      const res = await axios.post(`${API_BASE_URL}/skillposts`, updatedFormData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log(res.data);
      alert("Skill Post created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        imageUrls: ""
      });
      setImageFiles([]);

    } catch (error) {
      console.error("Error creating skill post:", error);
      alert("Failed to create skill post!");
    }
  };

  return (
    <div>
      <h2>Add Skill Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddSkillPost;
