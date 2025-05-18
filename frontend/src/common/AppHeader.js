import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppHeader.css';
import './header.css';
import axios from 'axios';

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      click: false,
      showDropdown: false,
      userProfile: {
        name: '',
        imageUrl: ''
      }
    };
  }

  componentDidMount() {
    // Fetch user profile data if authenticated
    if (this.props.authenticated) {
      this.fetchUserProfile();
    }
    // Add click listener to close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    // Remove event listener
    document.removeEventListener('click', this.handleOutsideClick);
  }

  componentDidUpdate(prevProps) {
    // Fetch profile when authentication status changes
    if (this.props.authenticated && !prevProps.authenticated) {
      this.fetchUserProfile();
    } else if (!this.props.authenticated && prevProps.authenticated) {
      // Clear profile data on logout
      this.setState({
        userProfile: {
          name: '',
          imageUrl: ''
        }
      });
    }
  }

  fetchUserProfile = () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      axios.get('http://localhost:8080/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          this.setState({ 
            userProfile: {
              name: res.data.name || '',
              imageUrl: res.data.imageUrl || ''
            }
          });
        })
        .catch(err => {
          console.error('Failed to fetch user profile:', err);
        });
    }
  };

  handleClick = () => {
    this.setState({ click: !this.state.click });
  };

  closeMobileMenu = () => {
    this.setState({ click: false });
  };

  handleProfileClick = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  handleOutsideClick = (event) => {
    if (!event.target.closest('.profile-section')) {
      this.setState({ showDropdown: false });
    }
  };

  handleLogout = () => {
    this.setState({ showDropdown: false });
    this.props.onLogout();
  };

  render() {
    const { authenticated } = this.props;
    const { click, showDropdown, userProfile } = this.state;

    return (
      <div>
        <header>
          <nav className="flexSB">
            <ul className={click ? "mobile-nav" : "flexSB"} onClick={this.closeMobileMenu}>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/courses">All Courses</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/SkillPostList">Skill Post</NavLink></li>
              <li><NavLink to="/LearningPlanList">Learning Plan</NavLink></li>
              <li><NavLink to="/LearningProgressList">Learning Progress</NavLink></li>
              <li><NavLink to="/journal">Journal</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
            
            <div className="header-right">
              <div className="start">
                <div className="button">EduBridge</div>
              </div>
              
              {authenticated ? (
                <div className="profile-section">
                  <div className="profile-avatar-wrapper" onClick={this.handleProfileClick}>
                    <div className="profile-avatar-small">
                      {userProfile.imageUrl ? (
                        <img src={userProfile.imageUrl} alt={userProfile.name} />
                      ) : (
                        <div className="text-avatar-small">
                          <span>{userProfile.name && userProfile.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <i className={`fa fa-chevron-down ${showDropdown ? 'rotate' : ''}`}></i>
                  </div>
                  
                  {showDropdown && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {userProfile.imageUrl ? (
                            <img src={userProfile.imageUrl} alt={userProfile.name} />
                          ) : (
                            <div className="text-avatar-large">
                              <span>{userProfile.name && userProfile.name[0]}</span>
                            </div>
                          )}
                        </div>
                        <div className="dropdown-user-info">
                          <span className="user-name">{userProfile.name}</span>
                        </div>
                      </div>
                      <hr className="dropdown-divider" />
                      <NavLink to="/profile" className="profile-link" onClick={() => this.setState({ showDropdown: false })}>
                        <i className="fa fa-user"></i>
                        View Profile
                      </NavLink>
                      <button onClick={this.handleLogout} className="logout-button">
                        <i className="fa fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <NavLink to="/login" className="auth-btn login-btn">Login</NavLink>
                  <NavLink to="/signup" className="auth-btn signup-btn">Sign Up</NavLink>
                </div>
              )}
              
              <button className="toggle" onClick={this.handleClick}>
                {click ? <i className="fa fa-times" /> : <i className="fa fa-bars" />}
              </button>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default AppHeader;