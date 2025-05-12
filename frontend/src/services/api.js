import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

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
  }
  
  // // Comment API calls (you will need to implement this on the backend)
  // addComment: (planId, comment) => {
  //   return axios.post(`${API_BASE_URL}/learning-plans/${planId}/comments`, comment);
  // },
  
  // // Like API calls (you will need to implement this on the backend)
  // likePlan: (planId) => {
  //   return axios.post(`${API_BASE_URL}/learning-plans/${planId}/likes`);
  // }
};

export default api;