import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem.js';
import api from '../services/api.js';

function CommentSection({ progressId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await api.getComments(progressId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchComments();
  }, [progressId]);
  

//   const fetchComments = async () => {
//     try {
//       const data = await api.getComments(progressId);
//       setComments(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//       setLoading(false);
//     }
//   };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const commentData = { content: newComment };
      const addedComment = await api.addComment(progressId, commentData);
      setComments([...comments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, commentData) => {
    try {
      const updatedComment = await api.updateComment(progressId, commentId, commentData);
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(progressId, commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
              />
            ))
          )}
          
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </>
      )}
    </div>
  );
}

export default CommentSection;