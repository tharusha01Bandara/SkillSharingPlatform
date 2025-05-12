import React, { useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';
import axios from "axios";
import { API_BASE_URL } from "../constants";
import "../styles/LearningPlanForm.css";

const updatePlan = async (id, data) => axios.put(`${API_BASE_URL}/learning-plans/${id}`, data);
const createPlan = async (data) => axios.post(`${API_BASE_URL}/learning-plans`, data);

function LearningPlanForm({ planToEdit, onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topics: "",
    resources: "",
    timeline: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // useEffect(() => {
  //   if (planToEdit) {
  //     setFormData({
  //       title: planToEdit.title || "",
  //       description: planToEdit.description || "",
  //       topics: planToEdit.topics || "",
  //       resources: planToEdit.resources || "",
  //       timeline: planToEdit.timeline || ""
  //     });
  //   }
  // }, [planToEdit]);

const { id } = useParams();
const history = useHistory();
// history.push('/LearningPlanList');

useEffect(() => {
  if (id) {
    axios.get(`${API_BASE_URL}/learning-plans/${id}`).then(res => {
      setFormData({
        title: res.data.title,
        description: res.data.description,
        topics: res.data.topics,
        resources: res.data.resources,
        timeline: res.data.timeline
      });
    });
  }
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setLoading(true);
  //   setShowSuccess(false);
  //   setShowError(false);
    
  //   try {
  //     if (planToEdit) {
  //       await updatePlan(planToEdit.id, formData);
  //     } else {
  //       await createPlan(formData);
  //     }

  //     setShowSuccess(true);
      
  //     // Reset form if creating new plan
  //     if (!planToEdit) {
  //       setFormData({
  //         title: "",
  //         description: "",
  //         topics: "",
  //         resources: "",
  //         timeline: ""
  //       });
  //     }
      
  //     if (onSubmitSuccess) {
  //       // Give time for success message to be seen
  //       setTimeout(() => {
  //         onSubmitSuccess();
  //       }, 1500);
  //     }
  //   } catch (error) {
  //     console.error("Error saving learning plan:", error);
  //     setShowError(true);
  //     setErrors({ submit: "Failed to save learning plan. Please try again." });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ...validation
    try {
      if (id) {
        await updatePlan(id, formData);
      } else {
        await createPlan(formData);
      }
      setShowSuccess(true);
      setTimeout(() => history.push("/LearningPlanList"), 1500);
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <div className="learning-plan-container">
      <div className="form-header">
        <h2>{planToEdit ? "Edit Learning Plan" : "Create Learning Plan"}</h2>
        <p>Plan your learning journey step by step</p>
      </div>

      {showSuccess && (
        <div className="alert success">
          Learning Plan {planToEdit ? "updated" : "created"} successfully!
        </div>
      )}

      {showError && (
        <div className="alert error">
          Failed to {planToEdit ? "update" : "create"} learning plan. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="learning-plan-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Enter the plan title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            placeholder="Briefly describe the learning plan"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "input-error" : ""}
          ></textarea>
          {errors.description && <p className="error-text">{errors.description}</p>}
        </div>

        {/* Topics */}
        <div className="form-group">
          <label htmlFor="topics">Topics</label>
          <input
            type="text"
            name="topics"
            id="topics"
            placeholder="E.g., React, Python, Data Structures"
            value={formData.topics}
            onChange={handleChange}
          />
        </div>

        {/* Resources */}
        <div className="form-group">
          <label htmlFor="resources">Resources</label>
          <textarea
            name="resources"
            id="resources"
            placeholder="E.g., Coursera, YouTube, Books"
            rows="2"
            value={formData.resources}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Timeline */}
        <div className="form-group">
          <label htmlFor="timeline">Timeline</label>
          <input
            type="text"
            name="timeline"
            id="timeline"
            placeholder="E.g., 3 months"
            value={formData.timeline}
            onChange={handleChange}
          />
        </div>

        {errors.submit && <p className="error-text center-text">{errors.submit}</p>}

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? "submitting" : ""}`}
          >
            {loading ? "Saving..." : planToEdit ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LearningPlanForm;
