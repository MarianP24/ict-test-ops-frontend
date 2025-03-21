import axios from 'axios';
import AuthService from './AuthService';
import config from '../config';

// config.api.baseUrl has the IP of the local machine running set in .env.development
const API_URL = `${config.api.baseUrl}/fixtures`;

class FixtureService {
    getAllFixtures() {
        console.log('Fetching fixtures from:', API_URL);
        return axios.get(`${API_URL}/list-all-fixtures`, { headers: AuthService.getAuthHeader() });
    }

    getFixtureById(id) {
        return axios.get(`${API_URL}/${id}`, { headers: AuthService.getAuthHeader() });
    }

    createFixture(fixture) {
        return axios.post(API_URL, fixture, { headers: AuthService.getAuthHeader() });
    }

    updateFixture(id, fixture) {
        return axios.put(`${API_URL}/${id}`, fixture, { headers: AuthService.getAuthHeader() });
    }

    deleteFixture(id) {
        return axios.delete(`${API_URL}/${id}`, { headers: AuthService.getAuthHeader() });
    }

    addFixtureToMachine(fixtureId, machineId) {
        return axios.post(
            `${API_URL}/${fixtureId}/machines/${machineId}`,
            {},
            { headers: AuthService.getAuthHeader() }
        );
    }

    createMaintenanceFixtureReport() {
        return axios.post(
            `${API_URL}/maintenance`,
            {},
            { headers: AuthService.getAuthHeader() }
        );
    }

    // Add this to FixtureService.js
    getMachineFixtureMap() {
        return axios.get(`${API_URL}/machineMap`, { headers: AuthService.getAuthHeader() });
    }

    getCounterContent() {
        return axios.get(`${API_URL}/counter`, { headers: AuthService.getAuthHeader() });
    }
}

export default new FixtureService();