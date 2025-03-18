// API utility functions

// Use environment variable for API URL without a localhost fallback for production
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Helper function to make API requests
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} options - Fetch options (method, headers, body)
 * @returns {Promise} - Response from the API
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // For deployments, we can use relative URLs if API_URL is empty
  const url = API_URL ? `${API_URL}${endpoint}` : endpoint;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  return response;
};

/**
 * Helper function for file uploads
 * @param {string} endpoint - The API endpoint
 * @param {FormData} formData - Form data with files
 * @returns {Promise} - Response from the API
 */
export const uploadFile = async (endpoint, formData) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // For deployments, we can use relative URLs if API_URL is empty
  const url = API_URL ? `${API_URL}${endpoint}` : endpoint;
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  return response;
};