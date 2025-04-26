import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppHeader.css';

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolled: false,
            mobileMenuOpen: false
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.scrollY > 20) {
            this.setState({ scrolled: true });
        } else {
            this.setState({ scrolled: false });
        }
    };

    toggleMobileMenu = () => {
        this.setState(prevState => ({
            mobileMenuOpen: !prevState.mobileMenuOpen
        }));
    };

    render() {
        const { scrolled, mobileMenuOpen } = this.state;
        const { authenticated, onLogout } = this.props;
        
        return (
            <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-container">
                    <div className="app-branding">
                        <Link to="/" className="app-logo">
                            <div className="logo-icon">
                                <span className="logo-text">E</span>
                            </div>
                            <div className="logo-text-container">
                                <span className="app-title">EduLearn</span>
                                <span className="app-tagline">Empowering Education</span>
                            </div>
                        </Link>
                    </div>
                    
                    <button 
                        className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
                        onClick={this.toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    
                    <div className={`nav-container ${mobileMenuOpen ? 'open' : ''}`}>
                        <nav className="main-nav">
                            <ul>
                                <li><NavLink to="/courses" activeClassName="active">Courses</NavLink></li>
                                <li><NavLink to="/resources" activeClassName="active">Resources</NavLink></li>
                                <li className="dropdown">
                                    <NavLink to="/community" activeClassName="active">Community</NavLink>
                                    <div className="dropdown-content">
                                        <Link to="/forums">Forums</Link>
                                        <Link to="/events">Events</Link>
                                        <Link to="/student-groups">Student Groups</Link>
                                    </div>
                                </li>
                                <li><NavLink to="/about" activeClassName="active">About Us</NavLink></li>
                            </ul>
                        </nav>
                        
                        <div className="search-box">
                            <input type="text" placeholder="Search..." />
                            <button className="search-btn" aria-label="Search">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <nav className="auth-nav">
                            {authenticated ? (
                                <ul>
                                    <li className="notification-item">
                                        <button className="icon-btn" aria-label="Notifications">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                            </svg>
                                            <span className="badge">2</span>
                                        </button>
                                    </li>
                                    <li className="dropdown">
                                        <a className="user-profile">
                                            <div className="avatar">
                                                <span>JD</span>
                                            </div>
                                        </a>
                                        <div className="dropdown-content profile-dropdown">
                                            <Link to="/dashboard">Dashboard</Link>
                                            <Link to="/profile">My Profile</Link>
                                            <Link to="/settings">Settings</Link>
                                            <div className="dropdown-divider"></div>
                                            <a onClick={onLogout} className="logout-link">Logout</a>
                                        </div>
                                    </li>
                                </ul>
                            ) : (
                                <ul>
                                    <li>
                                        <NavLink to="/login" className="login-link">Log In</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/signup" className="signup-btn">
                                            <span>Get Started</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
}

export default AppHeader;