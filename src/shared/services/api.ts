import axios from 'axios';

export const httpClient = axios.create({
  baseURL: '/service',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token handling if needed
httpClient.interceptors.request.use(
  (config) => {
    // Add authorization headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally here
    return Promise.reject(error);
  }
);

export default httpClient;
