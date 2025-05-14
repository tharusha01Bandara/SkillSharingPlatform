import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppHeader.css';
import './header.css';

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      click: false
    };
  }

  handleClick = () => {
    this.setState({ click: !this.state.click });
  };

  closeMobileMenu = () => {
    this.setState({ click: false });
  };

  render() {
    const { authenticated, onLogout } = this.props;
    const { click } = this.state;

    return (
      <div>
        <header>
          <nav className="flexSB">
            <ul className={click ? "mobile-nav" : "flexSB"} onClick={this.closeMobileMenu}>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/courses">All Courses</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/team">Team</NavLink></li>
              <li><NavLink to="/pricing">Pricing</NavLink></li>
              <li><NavLink to="/journal">Journal</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>

              {authenticated ? (
                React.createElement(React.Fragment, {}, 
                  <li><NavLink to="/profile">Profile</NavLink></li>,
                  <li><a onClick={onLogout}>Logout</a></li>
                )
              ) : (
                React.createElement(React.Fragment, {}, 
                  <li><NavLink to="/login">Login</NavLink></li>,
                  <li><NavLink to="/signup">Signup</NavLink></li>
                )
              )}
            </ul>
            <div className="start">
              <div className="button">GET CERTIFICATE</div>
            </div>
            <button className="toggle" onClick={this.handleClick}>
              {click ? <i className="fa fa-times" /> : <i className="fa fa-bars" />}
            </button>
          </nav>
        </header>
      </div>
    );
  }
}

export default AppHeader;
