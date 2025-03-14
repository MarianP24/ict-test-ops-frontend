import axios from 'axios';
import AuthService from './AuthService';
import config from '../config';

//config.api.basedUrl has the ip of the local machine is running set in .env.development
const API_URL = `${config.api.baseUrl}/machines`;


class MachineService {
    getAllMachines() {
        console.log('Fetching machines from:', API_URL);
        return axios.get(`${API_URL}/all`, { headers: AuthService.getAuthHeader() });
    }

    getAllMachinesDTO() {
        return axios.get(`${API_URL}/all-dto`, { headers: AuthService.getAuthHeader() });
    }

    getMachineById(id) {
        return axios.get(`${API_URL}/${id}`, { headers: AuthService.getAuthHeader() });
    }

    createMachine(machine) {
        return axios.post(API_URL, machine, { headers: AuthService.getAuthHeader() });
    }

    updateMachine(id, machine) {
        return axios.put(`${API_URL}/${id}`, machine, { headers: AuthService.getAuthHeader() });
    }

    deleteMachine(id) {
        return axios.delete(`${API_URL}/${id}`, { headers: AuthService.getAuthHeader() });
    }
}

export default new MachineService();