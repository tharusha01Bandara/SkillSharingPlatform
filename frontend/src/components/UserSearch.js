import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
import './UserSearch.css';

function UserSearch() {
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_BASE_URL}/user/me`, { headers })
      .then(res => {
        const userId = res.data.id;
        setCurrentUserId(userId);

        axios.get(`${API_BASE_URL}/user/${userId}/following-ids`, { headers })
          .then(followRes => setFollowingIds(followRes.data));

        axios.get(`${API_BASE_URL}/user/search?q=`, { headers })
          .then(userRes => {
            const others = userRes.data.filter(u => u.id !== userId);
            setAllUsers(others);
            setDisplayedUsers(others);
          });
      })
      .catch(err => console.error('User load error:', err));
  }, []);

  const handleSearch = () => {
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setDisplayedUsers(filtered);
  };

  const handleFollowToggle = async (targetId, isFollowing) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const url = `${API_BASE_URL}/user/${targetId}/${isFollowing ? 'unfollow' : 'follow'}`;
    try {
      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFollowingIds(prev =>
        isFollowing ? prev.filter(id => id !== targetId) : [...prev, targetId]
      );
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  return (
    <div className="user-search-container">
      <h2 className="user-search-title">👥 All Users</h2>
      <div className="user-search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="user-search-input"
        />
        <button onClick={handleSearch} className="user-search-button">Search</button>
      </div>

      <div className="user-card-grid">
        {displayedUsers.map(user => {
          const isFollowing = followingIds.includes(user.id);
          return (
            <div key={user.id} className="user-card">
              <img
                src={user.imageUrl || '/default-avatar.png'}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-card-body">
                <h3>{user.name}</h3>
                <p><strong>Profession:</strong> {user.profession || 'N/A'}</p>
                <p><strong>Skills:</strong> {user.skills || 'N/A'}</p>
                <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              </div>
              <button
                onClick={() => handleFollowToggle(user.id, isFollowing)}
                className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserSearch;
