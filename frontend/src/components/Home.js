import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../common/UserContext';


import './Home.css';

const Home = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);

  // Mock posts data - In a real app, this would come from an API
  const mockPosts = [
    {
      id: 1,
      userId: 1,
      user: {
        id: 1,
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      content: 'Just completed my React Native course! Building mobile apps has never been more exciting. Looking forward to creating my first production app. 🚀\n\nHere are my key takeaways:\n• Navigation is crucial for UX\n• State management with Redux is powerful\n• Testing is essential from day one',
      image: '/api/placeholder/600/400',
      timestamp: '2 hours ago',
      liked: false,
      likesCount: 24,
      commentsCount: 8,
      shareCount: 3,
      category: 'Mobile Development',
      tags: ['React Native', 'Mobile', 'JavaScript'],
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      userId: 2,
      user: {
        id: 2,
        name: 'Alex Rodriguez',
        username: 'alexdev',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      content: 'Quick tip for fellow developers: Use console.table() instead of console.log() when debugging arrays and objects. It provides a much cleaner output! 💡\n\nAlso, try using console.group() to organize your debug messages.',
      timestamp: '4 hours ago',
      liked: true,
      likesCount: 56,
      commentsCount: 12,
      shareCount: 15,
      category: 'JavaScript',
      tags: ['JavaScript', 'Debugging', 'Tips'],
      difficulty: 'Beginner'
    },
    {
      id: 3,
      userId: 3,
      user: {
        id: 3,
        name: 'Dr. Emily Watson',
        username: 'emilywatson',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      content: 'Excited to share my new course on Machine Learning fundamentals! Perfect for beginners who want to dive into AI. Early bird discount available this week.\n\nWhat you\'ll learn:\n• Linear regression\n• Classification algorithms\n• Neural network basics\n• Real-world applications',
      image: '/api/placeholder/600/300',
      timestamp: '6 hours ago',
      liked: false,
      likesCount: 89,
      commentsCount: 23,
      shareCount: 31,
      category: 'Machine Learning',
      tags: ['ML', 'AI', 'Course', 'Beginners'],
      difficulty: 'Beginner'
    },
    {
      id: 4,
      userId: 4,
      user: {
        id: 4,
        name: 'Michael Park',
        username: 'mikedesign',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      content: 'Just finished redesigning our company\'s dashboard. The key was focusing on user journey and reducing cognitive load. Here\'s what made the biggest impact:\n\n1. Simplified navigation\n2. Better visual hierarchy\n3. Consistent color system\n4. Responsive design principles',
      image: '/api/placeholder/600/350',
      timestamp: '8 hours ago',
      liked: true,
      likesCount: 42,
      commentsCount: 15,
      shareCount: 8,
      category: 'UI/UX Design',
      tags: ['Design', 'UX', 'Dashboard'],
      difficulty: 'Intermediate'
    },
    {
      id: 5,
      userId: 5,
      user: {
        id: 5,
        name: 'Lisa Kim',
        username: 'lisakim',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      content: 'Python list comprehensions are amazing! Here\'s a quick comparison between traditional loops and list comprehensions.\n\n```python\n# Traditional way\nresult = []\nfor x in range(10):\n    if x % 2 == 0:\n        result.append(x * 2)\n\n# List comprehension\nresult = [x * 2 for x in range(10) if x % 2 == 0]\n```\n\nMuch cleaner and more pythonic! 🐍',
      timestamp: '10 hours ago',
      liked: false,
      likesCount: 73,
      commentsCount: 19,
      shareCount: 12,
      category: 'Python',
      tags: ['Python', 'Programming', 'Best Practices'],
      difficulty: 'Intermediate'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'following') {
      // In a real app, check if user follows the post author
      return true;
    }
    return post.category.toLowerCase() === filter.toLowerCase();
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (sortBy === 'popular') {
      return b.likesCount - a.likesCount;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-container">
   

        {/* Feed Filters */}
        <div className="feed-filters">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
              </svg>
              All Posts
            </button>
            <button 
              className={`filter-tab ${filter === 'following' ? 'active' : ''}`}
              onClick={() => handleFilterChange('following')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Following
            </button>
            <button 
              className={`filter-tab ${filter === 'javascript' ? 'active' : ''}`}
              onClick={() => handleFilterChange('javascript')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              JavaScript
            </button>
            <button 
              className={`filter-tab ${filter === 'ui/ux design' ? 'active' : ''}`}
              onClick={() => handleFilterChange('ui/ux design')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Design
            </button>
            <button 
              className={`filter-tab ${filter === 'python' ? 'active' : ''}`}
              onClick={() => handleFilterChange('python')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 2v4l7 7-7 7v4"></path>
              </svg>
              Python
            </button>
          </div>

          {/* Sort Options */}
          <div className="sort-options">
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

   { /*    
        <div className="posts-feed">
          {sortedPosts.length === 0 ? (
            <div className="no-posts">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <h3>No posts found</h3>
              <p>Try changing your filter or create a new post!</p>
            </div>
          ) : (
            sortedPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={(postId) => {
                  setPosts(posts.map(p => 
                    p.id === postId 
                      ? { ...p, liked: !p.liked, likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1 }
                      : p
                  ));
                }}
              />
            ))
          )}
        </div>*/}

        {/* Load More Button */}
        {sortedPosts.length > 0 && (
          <div className="load-more">
            <button className="load-more-btn">
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;