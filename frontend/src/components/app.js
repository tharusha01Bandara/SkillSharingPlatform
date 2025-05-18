import React, { useState } from 'react';
import Header from './header.js';
import LearningProgressList from './LearningProgressList.js';
import LearningProgressForm from './LearningProgressForm.js';
import api from '../services/api.js';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewProgressClick = () => {
    setCurrentProgress(null);
    setShowForm(true);
  };

  const handleEditProgress = (progress) => {
    setCurrentProgress(progress);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentProgress) {
        await api.updateProgress(currentProgress.id, formData);
      } else {
        await api.createProgress(formData);
      }
      setShowForm(false);
      setCurrentProgress(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentProgress(null);
  };

  return (
    <div className="container">
      <Header onNewProgressClick={handleNewProgressClick} />
      
      {showForm ? (
        <LearningProgressForm 
          progress={currentProgress}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <LearningProgressList 
          key={refreshKey}
          onEditItem={handleEditProgress}
        />
      )}
    </div>
  );
}

export default App;