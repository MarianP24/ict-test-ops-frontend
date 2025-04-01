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

    getMachinesByFilters(filters) {
        // Only include non-empty values in the request
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if ((typeof value === 'string' && value.trim() !== '') ||
                (typeof value === 'number')) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return api.get(`${index.api.endpoints.machines}/filter`, {
            params: cleanFilters
        });
    }
}

export default new MachineService();