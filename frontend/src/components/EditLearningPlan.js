import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN } from "../constants";
import "../styles/EditLearningPlan.css";
import Footer from '../home/common/footer/Footer';

function EditLearningPlan() {
    const { planId } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        topics: "", 
        resources: "",
        timeline: ""
    });
    const [isSubmitting, setIsSubmitting] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get the auth token
    const getAuthHeader = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        return token ? { Authorization: `Bearer ${token}`} : {};
    };

    useEffect(() => {
        const fetchPlanDetails = async () => {
            try {
                // Conver planId to number to ensure it's the correct type
                const numericPlanId = parseInt(planId, 10);
                if (isNaN(numericPlanId)) {
                    console.error('Invalid plan ID format:', planId);
                    setError('Invalid plan ID format');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/learning-plans/${numericPlanId}`, {
                    headers: getAuthHeader()
                });

                console.log('Response status:', response.status);
                console.log('Response data:', response.data);

                if (response.status === 200 && response.data) {
                    const plan = response.data;
                    console.log('Setting form data with plan:', plan);

                    setFormData({
                        title: plan.title || '',
                        description: plan.description || '',
                        topics: plan.topics || '',
                        resources: plan.resources || '',
                        timeline: plan.timeline || ''
                    });
                } else {
                    console.error('Invalid response format:', response);
                    setError('Invalid response form server');
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching post details:", err);
                console.error("Error response:", err.response);
                console.error("Error request:", err.request);

                let errorMessage = "Failed to load plan details. Please try again later.";
                if (err.response) {
                    console.error("Error status:", err.response.status);
                    console.error("Error data:", err.response.data);
                    if (err.response.status == 401) {
                    errorMessage = "Please log in to view this plan";
                    // Redirect to login if unauthorized
                    history.push('/login');
                    } else if (err.response.status == 404) {
                        errorMessage = "Plan not found";
                    } else if (err.response.data && err.response.data.message) {
                        errorMessage = err.response.data.message;
                    }
                } else if (err.request) {
                    console.error("No response received from server");
                    errorMessage = "No response from server. Please check your connection.";
                }

                setError(errorMessage);
                setLoading(false);
            }
        };

        if (planId) {
            fetchPlanDetails();
        } else {
            console.error('No plan ID provided');
            setError('Invalid plan ID');
            setLoading(false);
        }
    }, [planId, history]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Update form data
            const updatedFormData = {
                ...formData
            }

            // 2. Update learning plan in backend
            const res = await axios.put(`${API_BASE_URL}/learning-plans/${planId}`, updatedFormData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 200) {
                // 3. Navigate to the plan details page
                history.push(`/learning-plan/${planId}`);
            }
        } catch (error) {
            console.error("Error updating skill post:", error);
            let errorMessage = "Failed to update learning plan. Please try again.";
            if (error.response) {
                if (error.response.status ===401) {
                    errorMessage = "Please log in to update this post";
                    history.push('/login');
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading post details...</p>
            </div>
        );
    }

    return (
        <div className="edit-learning-plan-wrapper">
            <div className="edit-learning-plan-container">
                <div className="form-header">
                    <h2>Edit Learning Plan</h2>
                    <p>Update your learning plan details</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="edit-learning-plan-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            placeholder="What learning plan are you sharing?"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                        id="description"
                        name="description"
                        placeholder="Share details about your plan."
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="5"
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="topics">Topics</label>
                        <textarea
                        id="topics"
                        name="topics"
                        placeholder="E.g. Python, Java, elc."
                        value={formData.topics}
                        onChange={handleInputChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="resources">Resources</label>
                        <textarea
                        id="resources"
                        name="resources"
                        placeholder="E.g. Youtube, books, etc."
                        value={formData.resources}
                        onChange={handleInputChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeline">Timeline</label>
                        <textarea
                        id="timeline"
                        name="timeline"
                        placeholder="E.g. 3 months"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button" 
                            className="cancel-button"
                            onClick={() => history.push(`/learning-plan/${planId}`)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" 
                            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Post'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
export default EditLearningPlan;