import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../common/UserContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { user } = useUser();

  const navigationItems = [
    {
      path: '/',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
      ),
      label: 'Home',
      count: null
    },
    {
      path: '/explore',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="10,8 16,12 10,16 10,8"></polygon>
        </svg>
      ),
      label: 'Explore',
      count: null
    },
    {
      path: '/messages',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      label: 'Messages',
      count: 3
    },
    {
      path: `/profile/${user && user.id ? user.id : ''}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      label: 'Profile',
      count: null
    },
    {
      path: '/settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 8v6m11-9a4 4 0 0 0 0 6m-9-9a4 4 0 0 0 0 6"></path>
        </svg>
      ),
      label: 'Settings',
      count: null
    }
  ];

  const trendingTopics = [
    { name: 'React Hooks', posts: '2.5k' },
    { name: 'Machine Learning', posts: '1.8k' },
    { name: 'Python Basics', posts: '1.2k' },
    { name: 'Web Design', posts: '890' },
    { name: 'Node.js', posts: '756' }
  ];

  const suggestedUsers = [
    {
      id: 10,
      name: 'Alice Johnson',
      username: 'alicecodes',
      avatar: '/api/placeholder/40/40',
      skills: ['Python', 'Data Science'],
      followers: '15.2k'
    },
    {
      id: 11,
      name: 'Mark Chen',
      username: 'markreact',
      avatar: '/api/placeholder/40/40',
      skills: ['React', 'TypeScript'],
      followers: '8.7k'
    },
    {
      id: 12,
      name: 'Sophie Turner',
      username: 'sophiedesign',
      avatar: '/api/placeholder/40/40',
      skills: ['UI/UX', 'Figma'],
      followers: '12.1k'
    }
  ];

  const activeCategories = [
    { name: 'Web Development', color: '#3b82f6' },
    { name: 'Data Science', color: '#10b981' },
    { name: 'Mobile Development', color: '#8b5cf6' },
    { name: 'UI/UX Design', color: '#f59e0b' },
    { name: 'Machine Learning', color: '#ef4444' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-content">
        {/* Main Navigation */}
        <div className="nav-section">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.count && <span className="nav-count">{item.count}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="nav-section">
          <h3 className="section-title">Your Activity</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{user && user.posts ? user.posts : 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{user && user.followers ? user.followers : 0}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="nav-section">
          <h3 className="section-title">Trending Topics</h3>
          <div className="trending-list">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="trending-item">
                <span className="trending-name">#{topic.name}</span>
                <span className="trending-count">{topic.posts} posts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Categories */}
        <div className="nav-section">
          <h3 className="section-title">Popular Categories</h3>
          <div className="categories-list">
            {activeCategories.map((category, index) => (
              <Link
                key={index}
                to={`/explore?category=${encodeURIComponent(category.name)}`}
                className="category-tag"
                style={{ borderColor: category.color }}
              >
                <span
                  className="category-dot"
                  style={{ backgroundColor: category.color }}
                ></span>
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Suggested Users */}
        <div className="nav-section">
          <h3 className="section-title">Connect with Others</h3>
          <div className="suggested-users">
            {suggestedUsers.map((suggestedUser) => (
              <div key={suggestedUser.id} className="suggested-user">
                <Link to={`/profile/${suggestedUser.id}`} className="user-info">
                  <img
                    src={suggestedUser.avatar}
                    alt={suggestedUser.name}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <span className="user-name">{suggestedUser.name}</span>
                    <span className="user-meta">@{suggestedUser.username}</span>
                    <div className="user-skills">
                      {suggestedUser.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <button className="follow-btn">Follow</button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="nav-footer">
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/help">Help</Link>
          </div>
          <p className="copyright">© 2025 LearnShare</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;