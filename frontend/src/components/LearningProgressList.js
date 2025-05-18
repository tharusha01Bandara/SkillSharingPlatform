import React from 'react';
import { useState, useEffect } from 'react';
import LearningProgressItem from './LearningProgressItem';
import LearningProgressForm from './LearningProgressForm';
import api from '../services/api';
import '../styles/LearningProgress.css';

function LearningProgressList() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(null);

  useEffect(() => {
    fetchAllProgress();
    
    // Add cool animation when component mounts
    const container = document.querySelector('.progress-container');
    if (container) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        container.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      }, 100);
    }
  }, []);

  const fetchAllProgress = async () => {
    try {
      const data = await api.getAllProgress();
      setProgressList(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (progressId) => {
    if (window.confirm('Are you sure you want to delete this progress?')) {
      try {
        await api.deleteProgress(progressId);
        
        // Animate the item before removing
        const item = document.querySelector(`[data-id="${progressId}"]`);
        if (item) {
          item.style.opacity = '0';
          item.style.transform = 'translateX(20px)';
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          
          setTimeout(() => {
            setProgressList(progressList.filter(item => item.id !== progressId));
          }, 300);
        } else {
          setProgressList(progressList.filter(item => item.id !== progressId));
        }
      } catch (error) {
        console.error('Error deleting progress:', error);
      }
    }
  };

  const handleEditProgress = (progress) => {
    setCurrentProgress(progress);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentProgress) {
        // Update existing progress
        await api.updateProgress(currentProgress.id, formData);
        // Refresh the list
        fetchAllProgress();
      } else {
        // Create new progress
        await api.createProgress(formData);
        fetchAllProgress();
      }
      // Hide form and reset current progress
      setShowForm(false);
      setCurrentProgress(null);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentProgress(null);
  };

  const handleAddNewProgress = () => {
    setCurrentProgress(null);
    setShowForm(true);
  };

  const getTotalSkills = () => {
    let skills = [];
    progressList.forEach(item => {
      if (item.skillsLearned) {
        const itemSkills = item.skillsLearned.split(',').map(skill => skill.trim());
        skills = [...skills, ...itemSkills];
      }
    });
    return [...new Set(skills)].length; // Count unique skills
  };

  if (loading) {
    return (
      <div className="progress-container">
        <div className="loading-state">
          Loading your learning journey...
        </div>
      </div>
    );
  }

  // Show form when adding new progress or editing existing progress
  if (showForm) {
    return (
      <div className="progress-container">
        <LearningProgressForm 
          progress={currentProgress} 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormCancel} 
        />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Learning Journey</h1>
          <p className="hero-description">
            Track your progress, celebrate your achievements, and visualize your growth as a developer
          </p>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="header-with-button">
          <div>
            <h2>Learning Progress</h2>
            {progressList.length > 0 && (
              <div className="stats-display">
                <span className="stats-item" data-tooltip="Total progress reports">
                  📝 {progressList.length} Reports
                </span>
                <span className="stats-item" data-tooltip="Unique skills learned">
                  ✨ {getTotalSkills()} Skills
                </span>
              </div>
            )}
          </div>
          <button 
            className="btn-primary"
            onClick={handleAddNewProgress}
          >
            Add new progress report
          </button>
        </div>
        
        {progressList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No learning progress yet</h3>
            <p className="empty-state-message">
              Start tracking your learning journey by adding your first progress report.
            </p>
          </div>
        ) : (
          <div className="progress-grid">
            {progressList.map((progress, index) => (
              <LearningProgressItem
                key={progress.id}
                progress={progress}
                onEdit={() => handleEditProgress(progress)}
                onDelete={() => handleDelete(progress.id)}
                animationDelay={index * 0.1}
                data-id={progress.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningProgressList;