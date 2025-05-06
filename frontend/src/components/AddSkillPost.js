import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import "../styles/AddSkillPost.css";

function AddSkillPost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrls: ""
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Generate preview URLs for selected images
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrls = [];

      // 1. Upload all selected images to Cloudinary
      if (imageFiles.length > 0) {
        for (let image of imageFiles) {
          const imageForm = new FormData();
          imageForm.append("file", image);
          imageForm.append("upload_preset", "ml_default");
          
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
        imageUrls: uploadedImageUrls.join(",")
      };

      // 3. Save skill post to backend
      const res = await axios.post(`${API_BASE_URL}/skillposts`, updatedFormData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log(res.data);
      
      // Show success message
      const successMessage = document.getElementById("success-message");
      successMessage.style.display = "block";
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        imageUrls: ""
      });
      setImageFiles([]);
      setImagePreviews([]);

    } catch (error) {
      console.error("Error creating skill post:", error);
      
      // Show error message
      const errorMessage = document.getElementById("error-message");
      errorMessage.style.display = "block";
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="skill-post-container">
      <div className="form-header">
        <h2>Share Your Skill</h2>
        <p>Share your expertise with the community</p>
      </div>
      
      <div id="success-message" className="alert success">
        Skill Post created successfully!
      </div>
      
      <div id="error-message" className="alert error">
        Failed to create skill post. Please try again.
      </div>
      
      <form onSubmit={handleSubmit} className="skill-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            placeholder="What skill are you sharing?"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Share details about your skill, experience level, and what you can teach others..."
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Images</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              multiple
              id="file-input"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              <i className="upload-icon">📷</i>
              <span>Choose images</span>
            </label>
          </div>
          
          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="preview-container">
                  <img 
                    src={preview} 
                    alt={`Preview ${index+1}`} 
                    className="image-preview" 
                  />
                </div>
              ))}
            </div>
          )}
          
          {imagePreviews.length > 0 && (
            <p className="file-info">{imageFiles.length} image(s) selected</p>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Skill'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSkillPost;