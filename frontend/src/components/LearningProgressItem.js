import React, { useState, useEffect, lazy, Suspense } from 'react';
import api from '../services/api.js';
import Header from './header.js';
import '../styles/LearningProgress.css';

// Lazy load the CommentSection component
const LazyCommentSection = lazy(() => import('./CommentSection.js'));

function LearningProgressItem({ progress, onEdit, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(progress.currentUserLiked);
  const [likeCount, setLikeCount] = useState(progress.likeCount);
  const [showForm, setShowForm] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(null);

  useEffect(() => {
    setLiked(progress.currentUserLiked);
    setLikeCount(progress.likeCount);
  }, [progress]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleNewProgressClick = () => {
    setCurrentProgress(null);
    setShowForm(true);
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

  return (
    <div className="card">
      <div className="content-header">
        {/* <Header onNewProgressClick={handleNewProgressClick} /> */}
        <h2>{progress.title}</h2>
        <div className="meta-info">
          Posted by {progress.user.username} on {formatDate(progress.createdAt)}
          {progress.updatedAt !== progress.createdAt && 
            ` (Updated: ${formatDate(progress.updatedAt)})`}
        </div>
        
        {progress.content && (
          <div>
            <strong>Content:</strong> {progress.tutorialCompleted}
          </div>
        )}
        
        {progress.tutorialCompleted && (
          <div>
            <strong>Tutorials Completed:</strong> {progress.tutorialCompleted}
          </div>
        )}
        
        {progress.skillsLearned && (
          <div>
            <strong>Skills Learned:</strong> {progress.skillsLearned}
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button 
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleToggleLike}
        >
          {liked ? 'Unlike' : 'Like'} ({likeCount})
        </button>
        
        <button className="comment-button" onClick={toggleComments}>
          {showComments ? 'Hide Comments' : `Show Comments (${progress.commentCount})`}
        </button>
        
        <button className="edit-button" onClick={() => onEdit(progress)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(progress.id)}>Delete</button>
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