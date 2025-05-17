import React, { useState, useEffect } from 'react';
import LearningProgressItem from './LearningProgressItem.js';
import api from '../services/api.js';

function LearningProgressList({ onEditItem }) {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProgress();
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
        setProgressList(progressList.filter(item => item.id !== progressId));
      } catch (error) {
        console.error('Error deleting progress:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading progress data...</div>;
  }

  return (
    <div>
      {progressList.length === 0 ? (
        <div className="card">
          <p>No learning progress entries yet. Add your first one!</p>
        </div>
      ) : (
        progressList.map(progress => (
          <LearningProgressItem
            key={progress.id}
            progress={progress}
            onEdit={onEditItem}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

export default LearningProgressList;
