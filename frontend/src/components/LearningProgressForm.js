import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/LearningProgress.css';

const API_BASE_URL = 'http://localhost:8080/api';

function LearningProgressForm({ progress, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tutorialCompleted: '',
    skillsLearned: '',
  });
  
  useEffect(() => {
    if (progress) {
      setFormData({
        title: progress.title || '',
        content: progress.content || '',
        tutorialCompleted: progress.tutorialCompleted || '',
        skillsLearned: progress.skillsLearned || '',
      });
    }
  }, [progress]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (onSubmit) {
        // Pass form data to the parent component handler
        onSubmit(formData);
      } else {
        // Fallback to direct API call if no handler is provided
        if (progress) {
          // Update existing progress
          await axios.put(`${API_BASE_URL}/progress/${progress.id}`, formData);
          alert('Progress updated successfully!');
        } else {
          // Create new progress
          await axios.post(`${API_BASE_URL}/progress`, formData);
          alert('Progress added successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  
  return (
    <div className="card">
      <h2>{progress ? 'Edit Progress' : 'Add New Progress'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <textarea
            name="content"
            placeholder="What did you learn?"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="tutorialCompleted"
            placeholder="Tutorials completed (e.g., React Basics, Java Spring)"
            value={formData.tutorialCompleted}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="skillsLearned"
            placeholder="Skills learned (e.g., React Hooks, Spring Security)"
            value={formData.skillsLearned}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">{progress ? 'Update' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
}

export default LearningProgressForm;