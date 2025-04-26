import React, { Component } from 'react';
import './Login.css';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN } from '../../constants';
import { login } from '../../util/APIUtils';
import { Link, Redirect } from 'react-router-dom';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import Alert from 'react-s-alert';

class Login extends Component {
    componentDidMount() {
        if(this.props.location.state && this.props.location.state.error) {
            setTimeout(() => {
                Alert.error(this.props.location.state.error, {
                    timeout: 5000
                });
                this.props.history.replace({
                    pathname: this.props.location.pathname,
                    state: {}
                });
            }, 100);
        }
    }
    
    render() {
        if(this.props.authenticated) {
            return <Redirect
                to={{
                pathname: "/",
                state: { from: this.props.location }
            }}/>;            
        }

        return (
            <div className="login-container">
                <div className="login-content">
                    <div className="login-header">
                        {/* Graduation Cap Icon */}
                        <div className="education-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                            </svg>
                        </div>
                        <h1>Welcome to LearnSphere</h1>
                        <p>Your gateway to knowledge and growth</p>
                    </div>
                    
                    <LoginForm {...this.props} />
                    
                    <div className="login-divider">
                        <span>or continue with</span>
                    </div>
                    
                    <SocialLogin />
                    
                    <div className="signup-section">
                        <p>New to LearnSphere?</p>
                        <Link to="/signup" className="signup-button">Create Account</Link>
                    </div>
                    
                    <div className="login-features">
                        <div className="feature">
                            {/* Book Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                            <span>Access all courses</span>
                        </div>
                        <div className="feature">
                            {/* Lightbulb Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18h6"></path>
                                <path d="M10 22h4"></path>
                                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                            </svg>
                            <span>Track your progress</span>
                        </div>
                        <div className="feature">
                            {/* Brain Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"></path>
                                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"></path>
                            </svg>
                            <span>Personalized learning</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberMe: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [inputName]: inputValue
        });        
    }

    handleSubmit(event) {
        event.preventDefault();   

        const loginRequest = {
            email: this.state.email,
            password: this.state.password
        };

        login(loginRequest)
        .then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            Alert.success("Welcome back to LearnSphere!");
            this.props.history.push("/");
        }).catch(error => {
            Alert.error((error && error.message) || 'Oops! Login failed. Please check your credentials and try again.');
        });
    }
    
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="login-form">
                <h2>Sign In to Your Account</h2>
                
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
                        placeholder="Enter your password"
                        value={this.state.password} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                
                <div className="form-extras">
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={this.state.rememberMe}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="rememberMe">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                </div>
                
                <button type="submit" className="btn-login">Sign In</button>
            </form>                    
        );
    }
}

class SocialLogin extends Component {
    render() {
        return (
            <div className="social-login">
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

export default Login;