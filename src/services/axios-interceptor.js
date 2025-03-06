import axios from 'axios';
import AuthService from './AuthService';

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Handle 401 error - Unauthorized
    if (error.response && error.response.status === 401) {
      // If we get a 401 response, the token is likely expired or invalid
      AuthService.logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axios;