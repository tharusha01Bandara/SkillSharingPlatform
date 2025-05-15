import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN } from "../constants";
import "../styles/EditSkillPost.css";
import Footer from '../home/common/footer/Footer';

function EditSkillPost() {
  const { postId } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrls: ""
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the auth token
  const getAuthHeader = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Convert postId to number to ensure it's the correct type
        const numericPostId = parseInt(postId, 10);
        if (isNaN(numericPostId)) {
          console.error('Invalid post ID format:', postId);
          setError('Invalid post ID format');
          setLoading(false);
          return;
        }

        console.log('Fetching post details for ID:', numericPostId);
        console.log('API URL:', `${API_BASE_URL}/skillposts/${numericPostId}`);
        
        const response = await axios.get(`${API_BASE_URL}/skillposts/${numericPostId}`, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        if (response.status === 200 && response.data) {
          const post = response.data;
          console.log('Setting form data with post:', post);
          
          setFormData({
            title: post.title || '',
            description: post.description || '',
            imageUrls: post.imageUrls || ''
          });
          
          // Set existing image previews if there are any
          if (post.imageUrls) {
            const imageUrls = post.imageUrls.split(',').map(url => url.trim());
            console.log('Setting image previews:', imageUrls);
            setImagePreviews(imageUrls);
          }
        } else {
          console.error('Invalid response format:', response);
          setError('Invalid response from server');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post details:", err);
        console.error("Error response:", err.response);
        console.error("Error request:", err.request);
        
        let errorMessage = "Failed to load post details. Please try again later.";
        if (err.response) {
          console.error("Error status:", err.response.status);
          console.error("Error data:", err.response.data);
          if (err.response.status === 401) {
            errorMessage = "Please log in to view this post";
            // Redirect to login if unauthorized
            history.push('/login');
          } else if (err.response.status === 404) {
            errorMessage = "Post not found";
          } else if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.request) {
          console.error("No response received from server");
          errorMessage = "No response from server. Please check your connection.";
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    } else {
      console.error('No post ID provided');
      setError('Invalid post ID');
      setLoading(false);
    }
  }, [postId, history]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 3 photos
    if (files.length > 3) {
      alert("You can only upload up to 3 photos per post.");
      return;
    }
    
    setImageFiles(files);
    
    // Generate preview URLs for selected images
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let uploadedImageUrls = [];

      // 1. Upload new images to Cloudinary if there are any
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
      } else {
        // If no new images, keep existing ones
        uploadedImageUrls = formData.imageUrls ? formData.imageUrls.split(',').map(url => url.trim()) : [];
      }

      // 2. Update form data
      const updatedFormData = {
        ...formData,
        imageUrls: uploadedImageUrls.join(",")
      };

      // 3. Update skill post in backend
      const res = await axios.put(`${API_BASE_URL}/skillposts/${postId}`, updatedFormData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {
        // 4. Navigate to the post detail page
        history.push(`/skill-post/${postId}`);
      }
    } catch (error) {
      console.error("Error updating skill post:", error);
      let errorMessage = "Failed to update skill post. Please try again.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Please log in to update this post";
          history.push('/login');
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post details...</p>
      </div>
    );
  }

  return (
    <div className="edit-skill-post-wrapper">
      <div className="edit-skill-post-container">
        <div className="form-header">
          <h2>Edit Skill Post</h2>
          <p>Update your skill post details</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-skill-post-form">
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
            <label>Update Images</label>
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
                <span>Choose new images (max 3)</span>
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
              <p className="file-info">{imagePreviews.length} image(s) selected</p>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => history.push(`/skill-post/${postId}`)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditSkillPost; 