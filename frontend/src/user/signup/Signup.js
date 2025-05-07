import React, { Component } from 'react';
import './Signup.css';
import { Link, Redirect } from 'react-router-dom';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from '../../constants';
import { signup } from '../../util/APIUtils';
import googleLogo from '../../img/google-logo.png';
import fbLogo from '../../img/fb-logo.png';
import githubLogo from '../../img/github-logo.png';
import Alert from 'react-s-alert';

class Signup extends Component {
    render() {
        if (this.props.authenticated) {
            return <Redirect
                to={{
                pathname: "/",
                state: { from: this.props.location }
            }}/>;            
        }

        return (
            <div className="signup-container">
                <div className="auth-wrapper">
                    <div className="auth-form">
                        <h2>Welcome Back</h2>
                        <p className="auth-subtitle">Sign up to continue your learning journey</p>
                        
                        <SocialSignup />
                        
                        <div className="or-separator">
                            <span className="or-text">OR</span>
                        </div>
                        
                        <SignupForm {...this.props} />
                        
                        <div className="auth-footer">
                            <span className="login-link">New to Academia? <Link to="/login">Sign up!</Link></span>
                        </div>
                    </div>
                    
                    <div className="auth-promo">
                        <div className="promo-content">
                            <h2>Join Our Learning Community</h2>
                            <p>Access thousands of courses and connect with experts worldwide.</p>
                            <button className="explore-btn">Explore Courses</button>
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
                    <img src={googleLogo} alt="Google" /> Continue with Google</a>
                <a className="social-btn facebook" href={FACEBOOK_AUTH_URL}>
                    <img src={fbLogo} alt="Facebook" /> Continue with Facebook</a>
                <a className="social-btn github" href={GITHUB_AUTH_URL}>
                    <img src={githubLogo} alt="Github" /> Continue with Github</a>
            </div>
        );
    }
}

class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
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

        const signUpRequest = Object.assign({}, this.state);

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
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        className="form-control" 
                        placeholder="Enter your email"
                        value={this.state.email} 
                        onChange={this.handleInputChange} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <div className="password-field">
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="Enter your password"
                            value={this.state.password} 
                            onChange={this.handleInputChange} 
                            required
                        />
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-login">Log In</button>
                </div>
            </form>                    
        );
    }
}

export default Signup;