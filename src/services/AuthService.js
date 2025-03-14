import config from '../config';
import api from './api.service';  // Import the API client

class AuthService {
    login(username, password) {
        return api
            .post(`${config.api.endpoints.auth}/signin`, { username, password })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(username, email, password) {
        return api.post(`${config.api.endpoints.auth}/signup`, {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isAuthenticated() {
        const user = this.getCurrentUser();
        return user && user.token;
    }

    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            return { Authorization: 'Bearer ' + user.token };
        } else {
            return {};
        }
    }

    // Role-related methods
    hasRole(roleName) {
        const user = this.getCurrentUser();
        if (!user || !user.roles) return false;

        return user.roles.includes(roleName);
    }

    isAdmin() {
        return this.hasRole('ROLE_ADMIN');
    }

    // User management methods
    getAllUsers() {
        // No need for headers here as they're added by the interceptor
        return api.get(config.api.endpoints.users);
    }

    updateUserRoles(userId, roles) {
        return api.put(`${config.api.endpoints.users}/${userId}/roles`, { roles });
    }

    getUserDetails(userId) {
        return api.get(`${config.api.endpoints.users}/${userId}`);
    }
}

export default new AuthService();