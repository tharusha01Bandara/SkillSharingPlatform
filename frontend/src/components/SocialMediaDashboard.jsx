import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './SocialMediaDashboard.css';

// Sample data for charts
const engagementData = [
  { name: 'Jan', followers: 4000, likes: 2400, shares: 1800 },
  { name: 'Feb', followers: 4200, likes: 2800, shares: 2000 },
  { name: 'Mar', followers: 5000, likes: 3200, shares: 2200 },
  { name: 'Apr', followers: 5500, likes: 3800, shares: 2400 },
  { name: 'May', followers: 6000, likes: 4000, shares: 2600 },
  { name: 'Jun', followers: 6200, likes: 4200, shares: 2800 },
  { name: 'Jul', followers: 6800, likes: 4800, shares: 3000 },
];

const platformData = [
  { name: 'Instagram', value: 40 },
  { name: 'Twitter', value: 30 },
  { name: 'Facebook', value: 20 },
  { name: 'LinkedIn', value: 10 },
];

// Recent notifications
const notifications = [
  { id: 1, text: 'New comment on your post', time: '2 min ago' },
  { id: 2, text: '15 new followers this week', time: '1 hour ago' },
  { id: 3, text: 'Your post reached 500 likes', time: '3 hours ago' },
  { id: 4, text: 'Trending post opportunity detected', time: '5 hours ago' },
];

// Recent posts with engagement stats
const recentPosts = [
  { 
    id: 1, 
    content: 'Excited to announce our new product launch next week! #innovation', 
    platform: 'Twitter',
    likes: 243,
    shares: 86,
    comments: 32
  },
  { 
    id: 2, 
    content: 'Check out our team building event from yesterday! Great team, great vision.', 
    platform: 'LinkedIn',
    likes: 512,
    shares: 128,
    comments: 64
  },
  { 
    id: 3, 
    content: 'How our customers are using our platform to grow their business', 
    platform: 'Facebook',
    likes: 387,
    shares: 97,
    comments: 46
  },
];

// Icons as pure SVG components
const TrendingUpIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const UsersIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MessageCircleIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const HeartIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const Share2Icon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const BarChart2Icon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const BellIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SettingsIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SearchIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const MenuIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Card component for metrics
const MetricCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {icon}
      </div>
      <div className="metric-values">
        <span className="metric-value">{value}</span>
        <span className={`metric-trend ${color}`}>
          <TrendingUpIcon size={16} className="trend-icon" />
          {trend}
        </span>
      </div>
    </div>
  );
};

// Main dashboard component
const SocialMediaDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="dashboard-container">
      {/* Mobile sidebar toggle */}
      <div className="mobile-toggle">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="toggle-button"
        >
          {sidebarOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <h1 className="sidebar-title">Social Dashboard</h1>
          
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <BarChart2Icon size={20} className="nav-icon" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="nav-item">
              <UsersIcon size={20} className="nav-icon" />
              <span>Audience</span>
            </a>
            <a href="#" className="nav-item">
              <MessageCircleIcon size={20} className="nav-icon" />
              <span>Comments</span>
            </a>
            <a href="#" className="nav-item">
              <BellIcon size={20} className="nav-icon" />
              <span>Notifications</span>
            </a>
            <a href="#" className="nav-item">
              <SettingsIcon size={20} className="nav-icon" />
              <span>Settings</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-content">
            <h2 className="page-title">Analytics Overview</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
              <SearchIcon size={18} className="search-icon" />
            </div>
          </div>
        </header>
        
        <main className="dashboard-main">
          {/* Metrics overview */}
          <div className="metrics-grid">
            <MetricCard 
              title="Total Followers" 
              value="24.5K" 
              icon={<UsersIcon size={20} className="icon blue" />} 
              trend="+12.5%" 
              color="green"
            />
            <MetricCard 
              title="Engagement Rate" 
              value="8.2%" 
              icon={<HeartIcon size={20} className="icon red" />} 
              trend="+3.1%" 
              color="green"
            />
            <MetricCard 
              title="Total Posts" 
              value="342" 
              icon={<MessageCircleIcon size={20} className="icon purple" />} 
              trend="+24" 
              color="green"
            />
            <MetricCard 
              title="Shares" 
              value="1.8K" 
              icon={<Share2Icon size={20} className="icon indigo" />} 
              trend="+15.3%" 
              color="green"
            />
          </div>
          
          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Engagement Growth</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={2} />
                    <Line type="monotone" dataKey="shares" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card">
              <h3 className="chart-title">Platform Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Recent posts and notifications */}
          <div className="content-grid">
            {/* Recent posts */}
            <div className="posts-container">
              <h3 className="section-title">Recent Posts</h3>
              <div className="posts-list">
                {recentPosts.map(post => (
                  <div key={post.id} className="post-item">
                    <div className="post-header">
                      <span className="post-platform">{post.platform}</span>
                      <span className="post-time">2 days ago</span>
                    </div>
                    <p className="post-content">{post.content}</p>
                    <div className="post-stats">
                      <span className="stat-item">
                        <HeartIcon size={14} className="stat-icon like" /> {post.likes}
                      </span>
                      <span className="stat-item">
                        <MessageCircleIcon size={14} className="stat-icon comment" /> {post.comments}
                      </span>
                      <span className="stat-item">
                        <Share2Icon size={14} className="stat-icon share" /> {post.shares}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notifications */}
            <div className="notifications-container">
              <h3 className="section-title">Notifications</h3>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-icon">
                      <BellIcon size={16} className="bell-icon" />
                    </div>
                    <div className="notification-content">
                      <p className="notification-text">{notification.text}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SocialMediaDashboard;