import axios from 'axios';
import index from '../config';

const apiClient = axios.create({
    baseURL: index.api.baseUrl,
    timeout: index.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Override the default timeout for individual requests
apiClient.defaults.timeout = index.api.timeout;

// Request interceptor for auth tokens and timeout logging
apiClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        
        // Log timeout configuration for debugging
        if (config.url?.includes('maintenance')) {
            console.log(`API Request - ${config.method?.toUpperCase()} ${config.url} - Timeout: ${config.timeout}ms`);
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Enhanced error logging for timeout issues
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            console.error('Request timeout error:', {
                url: error.config?.url,
                method: error.config?.method,
                timeout: error.config?.timeout,
                message: error.message
            });
        }
        
        // Handle global errors (401, 403, 500, etc.)
        // Maybe refresh token logic, redirect to login, etc.
        return Promise.reject(error);
    }
);

export default apiClient;