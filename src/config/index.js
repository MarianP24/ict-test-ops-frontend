// src/config/index.js
const config = {
    api: {
        // IP on which machine/server the app is running
        baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://10.169.6.39:8080'
        ,
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            // other endpoints
        },
        timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10),
    },
    features: {
        enableCache: process.env.REACT_APP_ENABLE_CACHE === 'true',
        // other feature flags
    },
    // other configuration categories
};

export default config;