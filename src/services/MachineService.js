import api from './api.service';
import index from '../config';

class MachineService {
    getAllMachines() {
        return api.get(`${index.api.endpoints.machines}/all`);
    }

    getAllMachinesDTO() {
        return api.get(`${index.api.endpoints.machines}/all-dto`);
    }

    getMachineById(id) {
        return api.get(`${index.api.endpoints.machines}/${id}`);
    }

    createMachine(machine) {
        return api.post(index.api.endpoints.machines, machine);
    }

    updateMachine(id, machine) {
        return api.put(`${index.api.endpoints.machines}/${id}`, machine);
    }

    deleteMachine(id) {
        return api.delete(`${index.api.endpoints.machines}/${id}`);
    }

    getMachineFixtures(machineId) {
        return api.get(`${index.api.endpoints.machines}/${machineId}/fixtures`);
    }
}

export default new MachineService();