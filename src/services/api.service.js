import axios from 'axios';
import index from '../config';

const apiClient = axios.create({
    baseURL: index.api.baseUrl,
    timeout: index.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors (401, 403, 500, etc.)
        // Maybe refresh token logic, redirect to login, etc.
        return Promise.reject(error);
    }
);

export default apiClient;