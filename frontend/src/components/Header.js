import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useUser } from '../common/UserContext';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, dispatch, ACTIONS } = useUser();
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      history.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    history.push('/');
  };

  const notifications = [
    { id: 1, text: 'Sarah liked your post', time: '2 min ago', read: false },
    { id: 2, text: 'New comment on your tutorial', time: '5 min ago', read: false },
    { id: 3, text: 'You have a new follower', time: '10 min ago', read: true }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LearnShare</span>
          </Link>
        </div>

        <div className="header-center">
          <form onSubmit={handleSearch} className="search-container">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search skills, tutorials, people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        <div className="header-right">
          <Link to="/create" className="btn btn-primary create-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create
          </Link>

          <div className="header-actions">
            <div className="action-item">
              <button className="action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 11.13v6.61C3 19.07 5.07 21 6.4 21h11.2c1.33 0 3.4-1.93 3.4-3.26v-6.61c0-.75-.3-1.47-.84-2.01l-.01-.01c-.54-.54-1.26-.84-2.01-.84H6.26c-.75 0-1.47.3-2.01.84C3.7 9.66 3 10.38 3 11.13Z"></path>
                  <path d="M7 12h10"></path>
                </svg>
              </button>
            </div>

            <div className="action-item notification-container">
              <button 
                className="action-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-badge">2</span>
              </button>

              {showNotifications && (
                <div className="notifications-panel">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button className="mark-read-btn">Mark all read</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                        <p>{notification.text}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="action-item profile-container">
              <button 
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img src={user && user.avatar ? user.avatar : '/api/placeholder/40/40'} alt={user && user.name ? user.name : 'User'} className="profile-avatar" />
                <span className="profile-name">{user && user.name ? user.name : 'User'}</span>
                <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showProfileMenu && (
                <div className="profile-menu">
                  <Link to={`/profile/${user && user.id ? user.id : ''}`} className="menu-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile
                  </Link>
                  <Link to="/settings" className="menu-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 8v6m11-6H7m10-3-3-3m0 6 3-3"></path>
                    </svg>
                    Settings
                  </Link>
                  <button className="menu-item logout-btn" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;