import React, { Component } from 'react';
import './Login.css';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN } from '../../constants';
import { login } from '../../util/APIUtils';
import { Link, Redirect } from 'react-router-dom';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import studentImage from '../../img/student-image.png'; // Add this image to your project
import Alert from 'react-s-alert';

class Login extends Component {
    componentDidMount() {
        // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
        // Here we display the error and then remove the error query parameter from the location.
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
            <div className="page-container">
                <div className="login-container">
                    <div className="login-content">
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Sign in to continue your learning journey</p>
                        
                        <SocialLogin />
                        <div className="or-separator">
                            <span className="or-text">OR</span>
                        </div>
                        <LoginForm {...this.props} />
                        <span className="signup-link">New to Academia? <Link to="/signup">Sign up!</Link></span>
                    </div>
                    <div className="login-image-container">
                        <img src={studentImage} alt="Student learning" className="login-image" />
                        <div className="login-image-text">
                            <h3>Join Our Learning Community</h3>
                            <p>Access thousands of courses and connect with experts worldwide.</p>
                            <Link to="/courses" className="explore-courses-btn">Explore Courses</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class SocialLogin extends Component {
    render() {
        return (
            <div className="social-login">
                <a className="btn social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src={googleLogo} alt="Google" /> Continue with Google</a>
                <a className="btn social-btn facebook" href={FACEBOOK_AUTH_URL}>
                    <img src={fbLogo} alt="Facebook" /> Continue with Facebook</a>
                <a className="btn social-btn github" href={GITHUB_AUTH_URL}>
                    <img src={githubLogo} alt="Github" /> Continue with Github</a>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : inputValue
        });        
    }

    handleSubmit(event) {
        event.preventDefault();   

        const loginRequest = Object.assign({}, this.state);

        login(loginRequest)
        .then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            Alert.success("You're successfully logged in!");
            this.props.history.push("/");
        }).catch(error => {
            Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
        });
    }
    
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="login-form">
                <div className="form-item">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email" 
                        className="form-control" 
                        placeholder="Enter your email"
                        value={this.state.email} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                <div className="form-item">
                    <div className="password-header">
                        <label htmlFor="password">Password</label>
                        <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                    </div>
                    <input 
                        type="password" 
                        id="password"
                        name="password" 
                        className="form-control" 
                        placeholder="Enter your password"
                        value={this.state.password} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                <div className="form-item">
                    <button type="submit" className="btn btn-primary">Log In</button>
                </div>
            </form>                    
        );
    }
}

export default Login;