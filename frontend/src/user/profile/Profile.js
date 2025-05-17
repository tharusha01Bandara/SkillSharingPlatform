import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { API_BASE_URL, ACCESS_TOKEN } from '../../constants';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    id: null,
    name: '',
    email: '',
    imageUrl: '',
    bio: '',
    skills: '',
    interests: '',
    location: '',
    profession: '',
    followersCount: 0,
    followingCount: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        alert('No token found. Please log in first.');
        setIsLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = userResponse.data;
        setProfile(prev => ({ ...prev, ...user, id: user.id }));

        // Fetch follower and following counts concurrently
        const [followersResponse, followingResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/${user.id}/followers/count`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/user/${user.id}/following/count`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProfile(prev => ({
          ...prev,
          followersCount: followersResponse.data,
          followingCount: followingResponse.data
        }));
      } catch (error) {
        alert('Unauthorized. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing(prev => !prev);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await axios.put(`${API_BASE_URL}/user/me`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally, you could reload the profile data here to revert changes
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const {
    name, email, imageUrl, bio, skills,
    interests, location, profession,
    followersCount, followingCount
  } = profile;

  // Format skills and interests as arrays for better display
  const skillsList = skills ? skills.split(',').map(skill => skill.trim()) : [];
  const interestsList = interests ? interests.split(',').map(interest => interest.trim()) : [];

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header Section */}
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-image-wrapper">
            <div className="profile-image">
              {imageUrl ? (
                <img src={imageUrl} alt={`${name}'s profile`} />
              ) : (
                <div className="avatar-placeholder">
                  <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                </div>
              )}
            </div>
          {!isEditing && (
              <button className="edit-profileee-btn" onClick={toggleEdit} title="Edit Profile">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L9.708 9l-3-3 5.146-5.146zM8.293 10.293l3-3L12.5 8.5l-3 3-1.414-1.414z"/>
                  <path d="M.5 14.5V11l9.793-9.793 3.5 3.5L4 14.293H.5z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="profile-info">
          <div className="profile-basic-info">
            <h1 className="profile-name">{name || 'User Name'}</h1>
            <p className="profile-email">{email}</p>
            {profession && <p className="profile-profession">{profession}</p>}
            {location && (
              <p className="profile-location">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                {location}
              </p>
            )}
          </div>

          {/* Stats Section */}
        {/* Stats Section */}
<div className="profile-stats">
  <div className="stat-item">
    <span className="stat-number">5</span>
    <span className="stat-label">Followers</span>
  </div>
  <div className="stat-item">
    <span className="stat-number">3</span>
    <span className="stat-label">Following</span>
  </div>
</div>
</div>





        {/* Profile Content Section */}
        <div className="profile-content">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="profession">Profession</label>
                <input
                  id="profession"
                  name="profession"
                  type="text"
                  value={profession}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer, Designer"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={skills}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="interests">Interests</label>
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  value={interests}
                  onChange={handleChange}
                  placeholder="e.g., Photography, Travel, Music (comma-separated)"
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-details">
              {bio && (
                <div className="detail-section">
                  <h3>About</h3>
                  <p className="bio-text">{bio}</p>
                </div>
              )}

              {skillsList.length > 0 && (
                <div className="detail-section">
                  <h3>Skills</h3>
                  <div className="tags-container">
                    {skillsList.map((skill, index) => (
                      <span key={index} className="tag skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {interestsList.length > 0 && (
                <div className="detail-section">
                  <h3>Interests</h3>
                  <div className="tags-container">
                    {interestsList.map((interest, index) => (
                      <span key={index} className="tag interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              {(!bio && skillsList.length === 0 && interestsList.length === 0) && (
                <div className="empty-state">
                  <p>Complete your profile to let others know more about you!</p>
                  <button className="btn btn-primary" onClick={toggleEdit}>
                    Complete Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;