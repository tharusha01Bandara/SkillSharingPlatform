import React, { useState, useEffect } from 'react';
import CommentSection from './CommentSection.js';
import api from '../services/api.js';

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

  return (
    <div className="card">
      <h2>{progress.title}</h2>
      <div className="meta-info">
        Posted by {progress.user.username} on {formatDate(progress.createdAt)}
        {progress.updatedAt !== progress.createdAt && 
          ` (Updated: ${formatDate(progress.updatedAt)})`}
      </div>
      
      <p>{progress.content}</p>
      
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
      
      <div className="likes">
        <button 
          className={liked ? 'liked' : ''} 
          onClick={handleToggleLike}
        >
          {liked ? 'Unlike' : 'Like'} ({likeCount})
        </button>
        
        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide Comments' : `Show Comments (${progress.commentCount})`}
        </button>
        
        <button onClick={() => onEdit(progress)}>Edit</button>
        <button className="delete" onClick={() => onDelete(progress.id)}>Delete</button>
      </div>
      
      {showComments && <CommentSection progressId={progress.id} />}
    </div>
  );
}

export default LearningProgressItem;