import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
// Replace useNavigate with useHistory for older versions of react-router-dom
import { useHistory } from "react-router-dom";
import "../styles/SkillPostList.css";

function SkillPostList() {
  // Replace useNavigate with useHistory
  const history = useHistory();
  const [skillPosts, setSkillPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Modern gradient backgrounds for cards
  const cardGradients = [
    "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    "linear-gradient(135deg, #ff6b6b 0%, #ffa07a 100%)",
    "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
    "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)",
    "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
    "linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)",
    "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  ];

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
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Function to get a gradient for a post based on its index
  const getCardGradient = (index) => {
    return cardGradients[index % cardGradients.length];
  };

  // Function to handle expanding/collapsing description
  const toggleExpandPost = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
    }
  };

  // Function to show notification
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Function to handle editing a skill post
  const handleEdit = (e, postId) => {
    e.stopPropagation();
    
    // Find the post to be edited
    const postToEdit = skillPosts.find(post => post.id === postId);
    
    if (postToEdit) {
      // Navigate to edit page with post data using history.push instead of navigate
      history.push(`/edit-skill-post/${postId}`, { post: postToEdit });
    } else {
      showNotification("Error finding post details", "error");
    }
  };

  // Function to handle deleting a skill post
  const handleDelete = async (e, postId) => {
    e.stopPropagation();
    
    // Get the post title for the confirmation message
    const postToDelete = skillPosts.find(post => post.id === postId);
    const title = postToDelete ? postToDelete.title : "this post";
    
    // Create a more attractive delete modal
    const confirmDelete = () => {
      return new Promise((resolve) => {
        // Create modal elements
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'delete-modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'delete-modal';
        
        modalContent.innerHTML = `
          <div class="delete-modal-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Confirm Deletion</h3>
          </div>
          <p>Are you sure you want to delete <strong>"${title}"</strong>?</p>
          <p class="delete-warning">This action cannot be undone.</p>
          <div class="delete-modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-btn">Delete</button>
          </div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Add animation class after a small delay for transition effect
        setTimeout(() => {
          modalOverlay.classList.add('visible');
          modalContent.classList.add('visible');
        }, 10);
        
        // Add event listeners
        const cancelBtn = modalContent.querySelector('.cancel-btn');
        const confirmBtn = modalContent.querySelector('.confirm-btn');
        
        cancelBtn.addEventListener('click', () => {
          closeModal(false);
        });
        
        confirmBtn.addEventListener('click', () => {
          closeModal(true);
        });
        
        // Close modal function
        const closeModal = (confirmed) => {
          modalOverlay.classList.remove('visible');
          modalContent.classList.remove('visible');
          
          setTimeout(() => {
            document.body.removeChild(modalOverlay);
            resolve(confirmed);
          }, 300); // Wait for animation to complete
        };
      });
    };

    // Show the custom delete modal
    const confirmed = await confirmDelete();
    
    if (confirmed) {
      try {
        setDeleteLoading(postId);
        await axios.delete(`${API_BASE_URL}/skillposts/${postId}`);
        
        // Remove the deleted post from state
        setSkillPosts(skillPosts.filter(post => post.id !== postId));
        
        // Show success notification
        showNotification(`"${title}" was successfully deleted.`, "success");
      } catch (err) {
        console.error("Failed to delete skill post", err);
        showNotification("Failed to delete the skill post. Please try again.", "error");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Generate random skill levels for demo purposes
  const getSkillLevel = () => {
    const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  return (
    <div className="skill-posts-container">
      {/* Notification component */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification({ show: false, message: "", type: "" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      
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
          <svg className="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && skillPosts.length === 0 && !error && (
        <div className="empty-state">
          <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <h3>No Skill Posts Yet</h3>
          <p>Be the first to share your skills with the community!</p>
          <button 
            className="create-post-btn" 
            onClick={() => history.push('/create-skill-post')}
          >
            Create Skill Post
          </button>
        </div>
      )}

      <div className="skill-posts-grid">
        {skillPosts.map((post, index) => (
          <div 
            key={post.id} 
            className={`skill-post-card ${expandedPost === post.id ? 'expanded' : ''}`}
            onClick={() => toggleExpandPost(post.id)}
          >
            <div className="card-gradient-header" style={{ background: getCardGradient(index) }}>
              <div className="post-category">
                <span className="category-badge">{getSkillLevel()}</span>
              </div>
              <h3 className="post-title">{post.title}</h3>
            </div>
            
            <div className="skill-post-content">
              <p className={`post-description ${expandedPost === post.id ? 'expanded-text' : ''}`}>
                {expandedPost === post.id ? post.description : truncateText(post.description)}
              </p>
              
              {post.description && post.description.length > 150 && expandedPost !== post.id && (
                <button className="read-more-btn" onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandPost(post.id);
                }}>
                  Read more
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              )}
              
              <div className="skill-summary">
                <h4>Skills Outline:</h4>
                <ul className="skills-list">
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Core {post.title.split(' ')[0]} fundamentals
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Advanced techniques
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Practical applications
                  </li>
                </ul>
              </div>
              
              {post.imageUrls && post.imageUrls.split(",").length > 0 && (
                <div className="post-images">
                  {post.imageUrls.split(",").slice(0, 3).map((url, imgIndex) => (
                    <div 
                      key={imgIndex} 
                      className="image-container"
                      style={{
                        backgroundImage: `url(${url.trim()})`,
                      }}
                    >
                      <img 
                        src={url.trim()} 
                        alt={`${post.title} - image ${imgIndex + 1}`}
                        className="hidden-img" // Hidden for accessibility
                      />
                    </div>
                  ))}
                  {post.imageUrls.split(",").length > 3 && (
                    <div className="more-images">
                      <span>+{post.imageUrls.split(",").length - 3}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="post-meta">
                <div className="post-time">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="post-actions">
                  <button 
                    className="edit-btn"
                    onClick={(e) => handleEdit(e, post.id)}
                    aria-label="Edit skill post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button 
                    className={`delete-btn ${deleteLoading === post.id ? 'loading' : ''}`}
                    onClick={(e) => handleDelete(e, post.id)}
                    disabled={deleteLoading === post.id}
                    aria-label="Delete skill post"
                  >
                    {deleteLoading === post.id ? 
                      <div className="btn-spinner"></div> : 
                      <span className="delete-btn-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Delete
                      </span>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="pagination-btn prev-btn" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Previous
        </button>
        <div className="page-numbers">
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
        </div>
        <button className="pagination-btn next-btn">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SkillPostList;