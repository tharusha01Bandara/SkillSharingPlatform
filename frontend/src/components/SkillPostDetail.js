import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import '../styles/SkillPostDetail.css';
import Footer from '../home/common/footer/Footer';

function SkillPostDetail() {
  const { postId } = useParams();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        console.log('Fetching post details for ID:', postId);
        console.log('API URL:', `${API_BASE_URL}/skillposts/${postId}`);
        
        const response = await axios.get(`${API_BASE_URL}/skillposts/${postId}`);
        console.log('Post details response:', response);
        
        if (response.status === 200 && response.data) {
          console.log('Setting post data:', response.data);
          setPost(response.data);
        } else {
          console.error('Invalid response format:', response);
          setError('Invalid response from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post details:', err);
        console.error('Error response:', err.response);
        console.error('Error request:', err.request);
        console.error('Error config:', err.config);
        
        let errorMessage = 'Failed to load post details. Please try again later.';
        
        if (err.response) {
          console.error('Error response status:', err.response.status);
          console.error('Error response data:', err.response.data);
          
          if (err.response.status === 404) {
            errorMessage = 'Post not found';
          } else if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.request) {
          console.error('No response received from server');
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          console.error('Error setting up request:', err.message);
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    } else {
      console.error('No post ID provided');
      setError('Invalid post ID');
      setLoading(false);
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => history.push('/SkillPostList')}>Back to Posts</button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="not-found-container">
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => history.push('/SkillPostList')}>Back to Posts</button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="post-detail-wrapper">
      <div className="post-detail-container">
        <div className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="post-date">
              <i className="far fa-clock"></i>
              Posted on {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="post-content">
          <div className="post-description">
            <h2>Description</h2>
            <p>{post.description}</p>
          </div>

          {post.imageUrls && (
            <div className="post-images">
              <h2>Images</h2>
              <div className="image-grid">
                {post.imageUrls.split(',').map((url, index) => (
                  <div key={index} className="image-container">
                    <img src={url} alt={`Post image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="post-actions">
          <button 
            className="back-button"
            onClick={() => history.push('/SkillPostList')}
          >
            Back to Posts
          </button>
          <button 
            className="edit-button"
            onClick={() => history.push(`/edit-skill-post/${postId}`)}
          >
            Edit Post
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SkillPostDetail; 