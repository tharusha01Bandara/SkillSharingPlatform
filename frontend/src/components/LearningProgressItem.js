import React, { useState, useEffect, lazy, Suspense } from 'react';
import api from '../services/api';
import '../styles/LearningProgress.css';

// Lazy load the CommentSection component
const LazyCommentSection = lazy(() => import('./CommentSection'));

function LearningProgressItem({ progress, onEdit, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(progress.currentUserLiked);
  const [likeCount, setLikeCount] = useState(progress.likeCount);

  useEffect(() => {
    setLiked(progress.currentUserLiked);
    setLikeCount(progress.likeCount);
  }, [progress]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleToggleLike = async () => {
    try {
      if (liked) {
        await api.unlikeProgress(progress.id);
        setLiked(false);
        setLikeCount(prevCount => prevCount - 1);
      } else {
        await api.likeProgress(progress.id);
        setLiked(true);
        setLikeCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(prevState => !prevState);
  };
  
  // Display skills as tags when available
  const renderSkillTags = () => {
    if (!progress.skillsLearned) return null;
    
    const skills = progress.skillsLearned.split(',').map(skill => skill.trim());
    
    return (
      <div className="skills-container">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="card" data-id={progress.id}>
      <div className="content-header">
        <h2>{progress.title}</h2>
        <div className="meta-info">
          Posted by {progress.user.username} on {formatDate(progress.createdAt)}
          {progress.updatedAt !== progress.createdAt && 
            ` (Updated: ${formatDate(progress.updatedAt)})`}
        </div>
        
        {progress.content && (
          <div className="content-detail">
            <strong>What I learned:</strong> {progress.content}
          </div>
        )}
        
        {progress.tutorialCompleted && (
          <div className="content-detail">
            <strong>Tutorials:</strong> {progress.tutorialCompleted}
          </div>
        )}
        
        {renderSkillTags()}
      </div>
      
      <div className="action-buttons">
        <button 
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleToggleLike}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        
        <button className="comment-button" onClick={toggleComments}>
          💬 {progress.commentCount || 0}
        </button>
        
        <button className="edit-button" onClick={() => onEdit(progress)}>
          ✏️ Edit
        </button>
        
        <button className="delete-button" onClick={() => onDelete(progress.id)}>
          🗑️ Delete
        </button>
      </div>
      
      {/* Comments section with proper rendering control */}
      {showComments && (
        <div className="comments-container">
          <Suspense fallback={<div>Loading comments...</div>}>
            <LazyCommentSection progressId={progress.id} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default LearningProgressItem;