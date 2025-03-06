import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const USERS_API_URL = 'http://localhost:8080/api/users';

class AuthService {
    login(username, password) {
        return axios
            .post(`${API_URL}/signin`, { username, password })
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
        return axios.post(`${API_URL}/signup`, {
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
        return axios.get(USERS_API_URL, {
            headers: this.getAuthHeader()
        });
    }

    updateUserRoles(userId, roles) {
        return axios.put(`${USERS_API_URL}/${userId}/roles`, 
            { roles },
            { headers: this.getAuthHeader() }
        );
    }

    getUserDetails(userId) {
        return axios.get(`${USERS_API_URL}/${userId}`, {
            headers: this.getAuthHeader()
        });
    }
}

export default new AuthService();