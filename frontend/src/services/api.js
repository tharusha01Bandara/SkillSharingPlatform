import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL2 = 'http://localhost:8080/api';

const api = {
  // Learning Plan API calls
  getAllPlans: () => {
    return axios.get(`${API_BASE_URL}/learning-plans`);
  },
  
  getPlanById: (id) => {
    return axios.get(`${API_BASE_URL}/learning-plans/${id}`);
  },
  
  createPlan: (plan) => {
    return axios.post(`${API_BASE_URL}/learning-plans`, plan);
  },
  
  updatePlan: (id, plan) => {
    return axios.put(`${API_BASE_URL}/learning-plans/${id}`, plan);
  },
  
  deletePlan: (id) => {
    return axios.delete(`${API_BASE_URL}/learning-plans/${id}`);
  },
  // Learning Progress APIs
  getAllProgress: async () => {
    const response = await axios.get(`${API_BASE_URL2}/progress`);
    return response.data;
  },

  getProgressById: async (progressId) => {
    const response = await axios.get(`${API_BASE_URL2}/progress/${progressId}`);
    return response.data;
  },

  createProgress: async (progressData) => {
    const response = await axios.post(`${API_BASE_URL2}/progress`, progressData);
    return response.data;
  },

  updateProgress: async (progressId, progressData) => {
    const response = await axios.put(`${API_BASE_URL2}/progress/${progressId}`, progressData);
    return response.data;
  },

  deleteProgress: async (progressId) => {
    await axios.delete(`${API_BASE_URL2}/progress/${progressId}`);
  },

  likeProgress: async (progressId) => {
    const response = await axios.post(`${API_BASE_URL2}/progress/${progressId}/like`);
    return response.data;
  },

  unlikeProgress: async (progressId) => {
    const response = await axios.delete(`${API_BASE_URL2}/progress/${progressId}/like`);
    return response.data;
  },

  // Comment APIs
  getComments: async (progressId) => {
    const response = await axios.get(`${API_BASE_URL2}/progress/${progressId}/comments`);
    return response.data;
  },

  addComment: async (progressId, commentData) => {
    const response = await axios.post(`${API_BASE_URL2}/progress/${progressId}/comments`, commentData);
    return response.data;
  },

  updateComment: async (progressId, commentId, commentData) => {
    const response = await axios.put(`${API_BASE_URL2}/progress/${progressId}/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteComment: async (progressId, commentId) => {
    await axios.delete(`${API_BASE_URL2}/progress/${progressId}/comments/${commentId}`);
  },
  
  // // Comment API calls (you will need to implement this on the backend)
  // addComment: (planId, comment) => {
  //   return axios.post(`${API_BASE_URL2}/learning-plans/${planId}/comments`, comment);
  // },
  
  // // Like API calls (you will need to implement this on the backend)
  // likePlan: (planId) => {
  //   return axios.post(`${API_BASE_URL}/learning-plans/${planId}/likes`);
  // }
};

export default api;