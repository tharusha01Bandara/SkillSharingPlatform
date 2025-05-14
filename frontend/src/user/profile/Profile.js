import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            isEditing: false,
            profile: {
                name: this.props.currentUser.name || '',
                email: this.props.currentUser.email || '',
                bio: this.props.currentUser.bio || 'No bio available',
                skills: this.props.currentUser.skills || [],
                interests: this.props.currentUser.interests || [],
                connections: this.props.currentUser.connections || 0,
                posts: this.props.currentUser.posts || 0,
                imageUrl: this.props.currentUser.imageUrl || ''
            },
            tempProfile: {}
        };
    }

    handleEdit = () => {
        this.setState({ 
            isEditing: true,
            tempProfile: { ...this.state.profile }
        });
    }

    handleSave = () => {
        this.setState({ 
            profile: { ...this.state.tempProfile },
            isEditing: false 
        });
        // Here you would typically make an API call to update the profile
        console.log('Profile updated:', this.state.tempProfile);
    }

    handleCancel = () => {
        this.setState({ isEditing: false });
    }

    handleInputChange = (field, value) => {
        this.setState({
            tempProfile: {
                ...this.state.tempProfile,
                [field]: value
            }
        });
    }

    handleSkillsChange = (skills) => {
        const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        this.setState({
            tempProfile: {
                ...this.state.tempProfile,
                skills: skillsArray
            }
        });
    }

    handleInterestsChange = (interests) => {
        const interestsArray = interests.split(',').map(interest => interest.trim()).filter(interest => interest);
        this.setState({
            tempProfile: {
                ...this.state.tempProfile,
                interests: interestsArray
            }
        });
    }

    render() {
        const { profile, isEditing, tempProfile } = this.state;
        const currentProfile = isEditing ? tempProfile : profile;

        return (
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-cover"></div>
                    <div className="profile-main">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar">
                                {currentProfile.imageUrl ? (
                                    <img src={currentProfile.imageUrl} alt={currentProfile.name} />
                                ) : (
                                    <div className="text-avatar">
                                        <span>{currentProfile.name && currentProfile.name[0]}</span>
                                    </div>
                                )}
                                {isEditing && (
                                    <div className="avatar-upload">
                                        <input
                                            type="url"
                                            placeholder="Image URL"
                                            value={tempProfile.imageUrl || ''}
                                            onChange={(e) => this.handleInputChange('imageUrl', e.target.value)}
                                            className="edit-input"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="profile-info">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={tempProfile.name || ''}
                                        onChange={(e) => this.handleInputChange('name', e.target.value)}
                                        className="edit-input edit-name"
                                        placeholder="Your name"
                                    />
                                ) : (
                                    <h1 className="profile-name">{currentProfile.name}</h1>
                                )}
                                
                                <p className="profile-email">{currentProfile.email}</p>
                                <p className="profile-id">ID: {this.props.currentUser.id}</p>
                                
                                {isEditing ? (
                                    <textarea
                                        value={tempProfile.bio || ''}
                                        onChange={(e) => this.handleInputChange('bio', e.target.value)}
                                        className="edit-input edit-bio"
                                        placeholder="Tell us about yourself..."
                                        rows="3"
                                    />
                                ) : (
                                    <p className="profile-bio">{currentProfile.bio}</p>
                                )}
                            </div>
                        </div>

                        <div className="profile-actions">
                            {isEditing ? (
                                <div className="edit-actions">
                                    <button onClick={this.handleSave} className="btn-save">Save</button>
                                    <button onClick={this.handleCancel} className="btn-cancel">Cancel</button>
                                </div>
                            ) : (
                                <button onClick={this.handleEdit} className="btn-edit">Edit Profile</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{currentProfile.posts}</span>
                        <span className="stat-label">Posts</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{currentProfile.connections}</span>
                        <span className="stat-label">Connections</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{currentProfile.skills.length}</span>
                        <span className="stat-label">Skills</span>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="details-section">
                        <h3>Skills</h3>
                        {isEditing ? (
                            <input
                                type="text"
                                value={tempProfile.skills ? tempProfile.skills.join(', ') : ''}
                                onChange={(e) => this.handleSkillsChange(e.target.value)}
                                className="edit-input"
                                placeholder="Enter skills separated by commas"
                            />
                        ) : (
                            <div className="tags-container">
                                {currentProfile.skills.map((skill, index) => (
                                    <span key={index} className="tag skill-tag">{skill}</span>
                                ))}
                                {currentProfile.skills.length === 0 && (
                                    <p className="empty-state">No skills added yet</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="details-section">
                        <h3>Interests</h3>
                        {isEditing ? (
                            <input
                                type="text"
                                value={tempProfile.interests ? tempProfile.interests.join(', ') : ''}
                                onChange={(e) => this.handleInterestsChange(e.target.value)}
                                className="edit-input"
                                placeholder="Enter interests separated by commas"
                            />
                        ) : (
                            <div className="tags-container">
                                {currentProfile.interests.map((interest, index) => (
                                    <span key={index} className="tag interest-tag">{interest}</span>
                                ))}
                                {currentProfile.interests.length === 0 && (
                                    <p className="empty-state">No interests added yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;