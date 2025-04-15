import api from './api.service';
import index from '../config';

class VpnServerService {
    getAllVpnServers(signal) {
        return api.get(`${index.api.endpoints.vpnServers}/all`, { signal });
    }

    getAllVpnServersDTO(signal) {
        return api.get(`${index.api.endpoints.vpnServers}/all-dto`, { signal });
    }

    getVpnServerById(id, signal) {
        return api.get(`${index.api.endpoints.vpnServers}/${id}`, { signal });
    }

    createVpnServer(vpnServer, signal) {
        return api.post(index.api.endpoints.vpnServers, vpnServer, { signal });
    }

    updateVpnServer(id, vpnServer, signal) {
        return api.put(`${index.api.endpoints.vpnServers}/${id}`, vpnServer, { signal });
    }

    deleteVpnServer(id, signal) {
        return api.delete(`${index.api.endpoints.vpnServers}/${id}`, { signal });
    }

    getVpnServerMachines(id, signal) {
        return api.get(`${index.api.endpoints.vpnServers}/${id}/machines`, { signal });
    }

    getVpnServerByName(vpnName, signal) {
        return api.get(`${index.api.endpoints.vpnServers}/by-name/${vpnName}`, { signal });
    }

    getVpnServersByFilters(filters, signal) {
        // Only include non-empty values in the request
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if ((typeof value === 'string' && value.trim() !== '') ||
                (typeof value === 'number')) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return api.get(`${index.api.endpoints.vpnServers}/filter`, {
            params: cleanFilters,
            signal
        });
    }
}

export default new VpnServerService();