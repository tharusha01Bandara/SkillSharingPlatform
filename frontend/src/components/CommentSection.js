import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem.js';
import api from '../services/api.js';

function CommentSection({ progressId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async() => {
      try {
        setLoading(true);
        const data = await api.getComments(progressId);
        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };
  
    fetchComments();
  }, [progressId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const commentData = { content: newComment };
      const addedComment = await api.addComment(progressId, commentData);
      setComments(prevComments => [...prevComments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const commentData = { content };
      const updatedComment = await api.updateComment(progressId, commentId, commentData);
      setComments(prevComments => 
        prevComments.map(c => c.id === commentId ? updatedComment : c)
      );
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(progressId, commentId);
      setComments(prevComments => 
        prevComments.filter(c => c.id !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const submitComment = () => {
    if (!newComment.trim()) return;
    
    const submitEvent = { preventDefault: () => {} };
    handleAddComment(submitEvent);
  };

  if(loading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={(content) => handleUpdateComment(comment.id, content)}
              onDelete={() => handleDeleteComment(comment.id)}
            />
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      <div className="add-comment-section">
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <button 
            onClick={submitComment} 
            className="submit-btn"
            disabled={!newComment.trim()}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;