const config = {
    api: {
        // IP on which machine/server the app is running
        baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.137:8080',
        // baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://10.169.6.39:8080',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            machines: '/machines',
            fixtures: '/fixtures'
        },
        timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10),
    },
    features: {
        enableCache: process.env.REACT_APP_ENABLE_CACHE === 'true',
    },
};

export default config;