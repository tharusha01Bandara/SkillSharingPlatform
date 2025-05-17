import React, { Component } from 'react';
import './Profile.css';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      profile: {
        name: '',
        email: '',
        imageUrl: '',
        bio: '',
        skills: '',
        interests: '',
        location: '',
        profession: ''
      }
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('accessToken');

    if (token) {
      axios.get('http://localhost:8080/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          this.setState({ profile: res.data });
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
            alert('Unauthorized. Please log in again.');
        });
    } else {
      alert('No token found. Please log in first.');
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      profile: {
        ...prevState.profile,
        [name]: value
      }
    }));
  };

  toggleEdit = () => {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing
    }));
  };

  handleSave = async () => {
    try {
       const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:8080/user/me', this.state.profile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({ isEditing: false });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };

  render() {
    const { name, email, imageUrl, bio, skills, interests, location, profession } = this.state.profile;
    const { isEditing } = this.state;

    return (
      <div className="profile-container">
        <div className="container">
          <div className="profile-info">
            <div className="profile-avatar">
              {imageUrl ? (
                <img src={imageUrl} alt={name} />
              ) : (
                <div className="text-avatar">
                  <span>{name && name[0]}</span>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="profile-edit-form">
                <input type="text" name="name" value={name} onChange={this.handleChange} placeholder="Name" />
                <input type="text" name="bio" value={bio} onChange={this.handleChange} placeholder="Bio" />
                <input type="text" name="skills" value={skills} onChange={this.handleChange} placeholder="Skills" />
                <input type="text" name="interests" value={interests} onChange={this.handleChange} placeholder="Interests" />
                <input type="text" name="location" value={location} onChange={this.handleChange} placeholder="Location" />
                <input type="text" name="profession" value={profession} onChange={this.handleChange} placeholder="Profession" />
                <button onClick={this.handleSave}>Save</button>
              </div>
            ) : (
              <div className="profile-details">
                <h2>{name}</h2>
                <p className="profile-email">{email}</p>
                <p><strong>Bio:</strong> {bio}</p>
                <p><strong>Skills:</strong> {skills}</p>
                <p><strong>Interests:</strong> {interests}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Profession:</strong> {profession}</p>
                <button onClick={this.toggleEdit}>Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
