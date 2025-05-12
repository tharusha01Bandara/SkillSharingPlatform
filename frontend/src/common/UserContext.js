import React, { createContext, useContext, useReducer, useEffect } from 'react';

// User context for managing global state
const UserContext = createContext();

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  ADD_POST: 'ADD_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  TOGGLE_LIKE: 'TOGGLE_LIKE',
  ADD_COMMENT: 'ADD_COMMENT',
  FOLLOW_USER: 'FOLLOW_USER',
  UNFOLLOW_USER: 'UNFOLLOW_USER'
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  posts: [],
  loading: false,
  error: null
};

// Reducer function
function userReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };

    case ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        posts: []
      };

    case ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case ACTIONS.ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };

    case ACTIONS.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? { ...post, ...action.payload } : post
        )
      };

    case ACTIONS.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };

    case ACTIONS.TOGGLE_LIKE:
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? {
                ...post,
                liked: !post.liked,
                likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1
              }
            : post
        )
      };

    case ACTIONS.ADD_COMMENT:
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: [...(post.comments || []), action.payload.comment],
                commentsCount: (post.commentsCount || 0) + 1
              }
            : post
        )
      };

    case ACTIONS.FOLLOW_USER:
      return {
        ...state,
        user: {
          ...state.user,
          following: [...(state.user.following || []), action.payload]
        }
      };

    case ACTIONS.UNFOLLOW_USER:
      return {
        ...state,
        user: {
          ...state.user,
          following: (state.user.following || []).filter(id => id !== action.payload)
        }
      };

    default:
      return state;
  }
}

// Mock data
const generateMockPosts = () => [
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
    content: 'Just completed my React Native course! Building mobile apps has never been more exciting. Looking forward to creating my first production app. 🚀',
    image: '/api/placeholder/600/400',
    timestamp: '2 hours ago',
    liked: false,
    likesCount: 24,
    commentsCount: 8,
    shareCount: 3,
    category: 'Mobile Development',
    tags: ['React Native', 'Mobile', 'JavaScript']
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
    content: 'Quick tip for fellow developers: Use console.table() instead of console.log() when debugging arrays and objects. It provides a much cleaner output! 💡',
    timestamp: '4 hours ago',
    liked: true,
    likesCount: 56,
    commentsCount: 12,
    shareCount: 15,
    category: 'JavaScript',
    tags: ['JavaScript', 'Debugging', 'Tips']
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
    content: 'Excited to share my new course on Machine Learning fundamentals! Perfect for beginners who want to dive into AI. Early bird discount available this week.',
    image: '/api/placeholder/600/300',
    timestamp: '6 hours ago',
    liked: false,
    likesCount: 89,
    commentsCount: 23,
    shareCount: 31,
    category: 'Machine Learning',
    tags: ['ML', 'AI', 'Course', 'Beginners']
  }
];

const generateMockUser = () => ({
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  avatar: '/api/placeholder/100/100',
  bio: 'Full-stack developer passionate about teaching and sharing knowledge. Love React, Node.js, and coffee!',
  followers: 1250,
  following: 420,
  posts: 87,
  skills: ['React', 'Node.js', 'Python', 'MongoDB'],
  verified: true,
  joinedDate: 'Joined March 2022'
});

// Provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    // Load mock user and posts on initialization
    dispatch({ type: ACTIONS.SET_USER, payload: generateMockUser() });
    
    // You can add real authentication logic here
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and load user
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch, ACTIONS }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;