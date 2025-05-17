import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import "../styles/LearningPlanList.css";
import { useHistory } from 'react-router-dom';
import Footer from '../home/common/footer/Footer';

function LearningPlanList() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [expandedPlans, setExpandedPlans] = useState({});

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = () => {
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/learning-plans`)
      .then(res => {
        setLearningPlans(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching learning plans:", err);
        setError("Failed to load learning plans. Please try again later.");
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
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Function to handle editing a Learning Plan
  const history = useHistory();
  const handleEdit = (planId) => {
    // Implement your edit navigation here
    // window.location.href = `/edit-learning-plan/${planId}`;
     history.push(`/edit-learning-plan/${planId}`);
  };

  const handleCreate = () => {
    history.push("/LearningPlanForm");
  };

  // Function to handle deleting learning plan
  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this learning plan?")) {
      try {
        setDeleteLoading(planId);
        await axios.delete(`${API_BASE_URL}/learning-plans/${planId}`);

        // Remove the deleted plan from state
        setLearningPlans(learningPlans.filter(plan => plan.id !== planId));

        // Show success message
        alert("Learning plan deleted successfully!");
      } catch (err) {
        console.error("Failed to delete learning plan", err);
        alert("Failed to delete learning plan, please try again");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Toggle expanded state for a plan
  const toggleExpand = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  // Function to determine which category/subject icon to show
  const getCategoryIcon = (plan) => {
    // You can extend this based on your categories or tags
    if (plan.category === 'programming') return '💻';
    if (plan.category === 'language') return '🗣️';
    if (plan.category === 'math') return '🧮';
    if (plan.category === 'science') return '🔬';
    if (plan.category === 'art') return '🎨';
    return '📚'; // Default icon
  };

  return (
    <div className="learning-plans-container">
      <div className="learning-plans-header">
        <h2>Explore Learning Plans</h2>
        <p className="subtitle">Discover plans and expertise shared by the community</p>
        
        <div className="header-actions">
          <button className="create-plan-btn" onClick={handleCreate}>
            <span className="btn-icon">+</span>
            Create New Plan
          </button>
          <button className="refresh-btn" onClick={fetchLearningPlans} disabled={isLoading}>
            <span className="refresh-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading learning plans...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchLearningPlans}>Try Again</button>
        </div>
      )}

      {!isLoading && learningPlans.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Learning Plans Yet</h3>
          <p>Be the first to share your learning plans with the community!</p>
          <button className="create-plan-btn-empty">Create Your First Plan</button>
        </div>
      )}

      <div className="learning-plans-grid">
        {learningPlans.map(plan => (
          <div key={plan.id} className="learning-plan-card">
            <div className="card-category-badge">
              <span className="category-icon">{getCategoryIcon(plan)}</span>
              <span className="category-text">{plan.category || 'General'}</span>
            </div>
            
            <div className="learning-plan-content">
              <div className="plan-header">
                <h3 className="plan-title">{plan.title}</h3>
                <div className="plan-actions">
                  {/* <button
                    className="edit-btn"
                    onClick={() => handleEdit(plan.id)}
                    aria-label="Edit learning plan"
                  >
                    <i className="edit-icon">✏️</i>
                  </button> */}
                  {/* <button
                    className={`delete-btn ${deleteLoading === plan.id ? 'loading' : ''}`}
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleteLoading === plan.id}
                    aria-label="Delete learning plan"
                  >
                    {deleteLoading === plan.id ?
                      <div className="btn-spinner"></div> :
                      <i className="delete-icon">🗑️</i>
                    }
                  </button> */}
                </div>
              </div>

              <p className="plan-description">
                {expandedPlans[plan.id] ? plan.description : truncateText(plan.description)}
              </p>

              {plan.description && plan.description.length > 150 && (
                <button 
                  className="read-more-btn"
                  onClick={() => toggleExpand(plan.id)}
                >
                  {expandedPlans[plan.id] ? "Show less" : "Read more"}
                </button>
              )}

              <div className="plan-stats">
                <div className="stat-item">
                  <span className="stat-icon">📋</span>
                  <span className="stat-text">{(plan.modules && plan.modules.length) || 0} Modules</span>

                </div>
                <div className="stat-item">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-text">{plan.estimatedHours || '?'} Hours</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">👥</span>
                  <span className="stat-text">{plan.enrollments || 0} Enrolled</span>
                </div>
              </div>

              {/* <div className="plan-meta">
                <div className="plan-time">
                  <span className="meta-label">Created:</span> {formatDate(plan.createdAt)}
                </div>
                {plan.updatedAt !== plan.createdAt && (
                  <div className="plan-time">
                    <span className="meta-label">Updated:</span> {formatDate(plan.updatedAt)}
                  </div>
                )}
                <div className="plan-author">
                  <span className="meta-label">Author:</span> {plan.author || 'Unknown'}
                </div>
              </div> */}

              <p className="plan-timeline">
                {expandedPlans[plan.id] ? plan.timeline : truncateText(plan.timeline)}
              </p>

              {/* {plan.description && plan.description.length > 150 && (
                <button 
                  className="read-more-btn"
                  onClick={() => toggleExpand(plan.id)}
                >
                  {expandedPlans[plan.id] ? "Show less" : "Read more"}
                </button>
              )} */}

              <div className="plan-footer">
                {/* <button className="view-details-btn">View Details</button> */}
                <button
                    className="edit-btn"
                    onClick={() => handleEdit(plan.id)}
                    aria-label="Edit learning plan"
                  >
                    {/* <i className="edit-icon">✏️</i> */}
                    Update
                  </button>
                {/* <button className="enroll-btn">
                  <span className="enroll-icon">✓</span>
                  Enroll Now
                </button> */}
                <button
                    className={`delete-btn ${deleteLoading === plan.id ? 'loading' : ''}`}
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleteLoading === plan.id}
                    aria-label="Delete learning plan"
                  >
                    {/* {deleteLoading === plan.id ?
                      <div className="btn-spinner"></div> :
                      // <i className="delete-icon">🗑️</i>
                    } */}
                    Delete
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default LearningPlanList;