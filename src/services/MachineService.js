import api from './api.service';
import index from '../config';

class MachineService {
    getAllMachines(signal) {
        return api.get(`${index.api.endpoints.machines}/all`, { signal });
    }

    getAllMachinesDTO(signal) {
        return api.get(`${index.api.endpoints.machines}/all-dto`, { signal });
    }

    getMachineById(id, signal) {
        return api.get(`${index.api.endpoints.machines}/${id}`, { signal });
    }

    createMachine(machine, signal) {
        return api.post(index.api.endpoints.machines, machine, { signal });
    }

    updateMachine(id, machine, signal) {
        return api.put(`${index.api.endpoints.machines}/${id}`, machine, { signal });
    }

    deleteMachine(id, signal) {
        return api.delete(`${index.api.endpoints.machines}/${id}`, { signal });
    }

    getMachineFixtures(machineId, signal) {
        return api.get(`${index.api.endpoints.machines}/${machineId}/fixtures`, { signal });
    }

    getMachinesByFilters(filters, signal) {
        // Only include non-empty values in the request
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if ((typeof value === 'string' && value.trim() !== '') ||
                (typeof value === 'number')) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return api.get(`${index.api.endpoints.machines}/filter`, {
            params: cleanFilters,
            signal
        });
    }

    assignVpnServer(machineId, vpnServerId, signal) {
        return api.put(`${index.api.endpoints.machines}/${machineId}/assign-vpn`, null, {
            params: { vpnServerId },
            signal
        });
    }

    removeVpnServer(machineId, signal) {
        return api.put(`${index.api.endpoints.machines}/${machineId}/remove-vpn`, null, { signal });
    }

}

export default new MachineService();