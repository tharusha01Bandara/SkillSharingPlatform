import React, { Component } from 'react';
import './Signup.css';
import { Link, Redirect } from 'react-router-dom'
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from '../../constants';
import { signup } from '../../util/APIUtils';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import Alert from 'react-s-alert';

class Signup extends Component {
    render() {
        if(this.props.authenticated) {
            return <Redirect
                to={{
                pathname: "/",
                state: { from: this.props.location }
            }}/>;            
        }

        return (
            <div className="signup-container">
                <div className="signup-content">
                    <div className="signup-header">
                        {/* Graduation Cap Icon */}
                        <div className="education-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                            </svg>
                        </div>
                        <h1>Join LearnSphere</h1>
                        <p>Begin your learning journey today</p>
                    </div>
                    
                    <SignupForm {...this.props} />
                    
                    <div className="signup-divider">
                        <span>or sign up with</span>
                    </div>
                    
                    <SocialSignup />
                    
                    <div className="login-section">
                        <p>Already have an account?</p>
                        <Link to="/login" className="login-button">Sign In</Link>
                    </div>
                    
                    <div className="signup-benefits">
                        <h3>Benefits of joining:</h3>
                        <div className="benefits-grid">
                            <div className="benefit">
                                {/* Certificate Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="3" width="16" height="18" rx="2" ry="2"></rect>
                                    <line x1="9" y1="7" x2="15" y2="7"></line>
                                    <line x1="9" y1="11" x2="15" y2="11"></line>
                                    <line x1="9" y1="15" x2="13" y2="15"></line>
                                </svg>
                                <span>Earn certificates</span>
                            </div>
                            <div className="benefit">
                                {/* Users Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Join our community</span>
                            </div>
                            <div className="benefit">
                                {/* Star Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                <span>Unlock premium courses</span>
                            </div>
                            <div className="benefit">
                                {/* Clock Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>Learn at your own pace</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class SocialSignup extends Component {
    render() {
        return (
            <div className="social-signup">
                <a className="social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src={googleLogo} alt="Google" />
                    <span>Google</span>
                </a>
                <a className="social-btn facebook" href={FACEBOOK_AUTH_URL}>
                    <img src={fbLogo} alt="Facebook" />
                    <span>Facebook</span>
                </a>
                <a className="social-btn github" href={GITHUB_AUTH_URL}>
                    <img src={githubLogo} alt="Github" />
                    <span>GitHub</span>
                </a>
            </div>
        );
    }
}

class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [inputName] : inputValue
        });        
    }

    handleSubmit(event) {
        event.preventDefault();   

        if (this.state.password !== this.state.confirmPassword) {
            Alert.error("Passwords don't match!");
            return;
        }

        if (!this.state.agreeTerms) {
            Alert.error("Please agree to the Terms of Service and Privacy Policy");
            return;
        }

        const signUpRequest = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        };

        signup(signUpRequest)
        .then(response => {
            Alert.success("You're successfully registered. Please login to continue!");
            this.props.history.push("/login");
        }).catch(error => {
            Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');            
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="signup-form">
                <h2>Create Your Account</h2>
                
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                        id="name"
                        type="text" 
                        name="name" 
                        className="form-control" 
                        placeholder="Enter your full name"
                        value={this.state.name} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        id="email"
                        type="email" 
                        name="email" 
                        className="form-control" 
                        placeholder="your@email.com"
                        value={this.state.email} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password" 
                        name="password" 
                        className="form-control" 
                        placeholder="Create a strong password"
                        value={this.state.password} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        id="confirmPassword"
                        type="password" 
                        name="confirmPassword" 
                        className="form-control" 
                        placeholder="Confirm your password"
                        value={this.state.confirmPassword} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                
                <div className="terms-checkbox">
                    <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={this.state.agreeTerms}
                        onChange={this.handleInputChange}
                        required
                    />
                    <label htmlFor="agreeTerms">
                        I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                    </label>
                </div>
                
                <button type="submit" className="btn-signup">Create Account</button>
            </form>                    
        );
    }
}

export default Signup;