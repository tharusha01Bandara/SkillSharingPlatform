import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

function LearningProgressForm({ progress, onSuccess, onCancel }) {
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
      if (progress) {
        // Update existing progress
        await axios.put(`${API_BASE_URL}/progress/${progress.id}`, formData);
      } else {
        // Create new progress
        await axios.post(`${API_BASE_URL}/progress`, formData);
      }
      if (onSuccess) onSuccess();
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
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">{progress ? 'Update' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
}

export default LearningProgressForm;
