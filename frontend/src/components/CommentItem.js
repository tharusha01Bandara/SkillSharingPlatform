import React, { useState } from 'react';
import '../styles/CommentItem.css';

function CommentItem({ comment, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleUpdate = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onUpdate(editContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="user-info">
          {comment.user && comment.user.imageUrl && (
            <img 
              src={comment.user.imageUrl} 
              alt={`${comment.user.name}'s avatar`} 
              className="user-avatar" 
            />
          )}
          <span className="user-name">{comment.user ? comment.user.name : 'Anonymous'}</span>
        </div>
        <div className="comment-date">
          {formatDate(comment.createdAt)}
        </div>
      </div>
      
      <div className="comment-content">
        {isEditing ? (
          <div className="edit-mode">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
            <div className="edit-actions">
              <button onClick={handleUpdate} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <p>{comment.content}</p>
            <div className="comment-actions">
              <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
              <button onClick={onDelete} className="delete-btn">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;