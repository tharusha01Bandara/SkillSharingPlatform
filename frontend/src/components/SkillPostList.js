import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import "../styles/SkillPostList.css";

function SkillPostList() {
  const [skillPosts, setSkillPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchSkillPosts();
  }, []);

  const fetchSkillPosts = () => {
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/skillposts`)
      .then(res => {
        setSkillPosts(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch skill posts", err);
        setError("Failed to load skill posts. Please try again later.");
        setIsLoading(false);
      });
  };

  // Function to format date in a more readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to truncate text if it's too long
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Function to handle editing a skill post
  const handleEdit = (postId) => {
    // You can navigate to edit page or open a modal
    // For now, we'll just alert
    alert(`Edit post with ID: ${postId}`);
    
    // Alternatively, you could navigate using React Router:
    // history.push(`/edit-skill-post/${postId}`);
    // or window.location.href = `/edit-skill-post/${postId}`;
  };

  // Function to handle deleting a skill post
  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this skill post?")) {
      try {
        setDeleteLoading(postId);
        await axios.delete(`${API_BASE_URL}/skillposts/${postId}`);
        
        // Remove the deleted post from state
        setSkillPosts(skillPosts.filter(post => post.id !== postId));
        
        // Show success message
        alert("Skill post deleted successfully!");
      } catch (err) {
        console.error("Failed to delete skill post", err);
        alert("Failed to delete skill post. Please try again.");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  return (
    <div className="skill-posts-container">
      <div className="skill-posts-header">
        <h2>Explore Skill Posts</h2>
        <p className="subtitle">Discover skills and expertise shared by the community</p>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading skill posts...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && skillPosts.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Skill Posts Yet</h3>
          <p>Be the first to share your skills with the community!</p>
        </div>
      )}

      <div className="skill-posts-grid">
        {skillPosts.map(post => (
          <div key={post.id} className="skill-post-card">
            <div className="skill-post-content">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(post.id)}
                    aria-label="Edit skill post"
                  >
                    <i className="edit-icon">✏️</i>
                  </button>
                  <button 
                    className={`delete-btn ${deleteLoading === post.id ? 'loading' : ''}`}
                    onClick={() => handleDelete(post.id)}
                    disabled={deleteLoading === post.id}
                    aria-label="Delete skill post"
                  >
                    {deleteLoading === post.id ? 
                      <div className="btn-spinner"></div> : 
                      <i className="delete-icon">🗑️</i>
                    }
                  </button>
                </div>
              </div>
              
              <p className="post-description">{truncateText(post.description)}</p>
              
              {post.description.length > 150 && (
                <button className="read-more-btn">Read more</button>
              )}
              
              <div className="post-meta">
                <div className="post-time">
                  <span className="meta-label">Posted:</span> {formatDate(post.createdAt)}
                </div>
                {post.updatedAt !== post.createdAt && (
                  <div className="post-time">
                    <span className="meta-label">Updated:</span> {formatDate(post.updatedAt)}
                  </div>
                )}
              </div>
            </div>

            {post.imageUrls && post.imageUrls.split(",").length > 0 && (
              <div className="post-images">
                {post.imageUrls.split(",").map((url, index) => (
                  <div 
                    key={index} 
                    className="image-container"
                    style={{
                      backgroundImage: `url(${url.trim()})`,
                    }}
                  >
                    <img 
                      src={url.trim()} 
                      alt={`${post.title} - image ${index + 1}`}
                      className="hidden-img" // Hidden for accessibility
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillPostList;