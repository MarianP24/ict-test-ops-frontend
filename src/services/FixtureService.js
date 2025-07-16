import api from './api.service';
import index from '../config';

class FixtureService {
    getAllFixtures(signal) {
        return api.get(`${index.api.endpoints.fixtures}/list-all-fixtures`, { signal });
    }

    getFixtureById(id, signal) {
        return api.get(`${index.api.endpoints.fixtures}/${id}`, { signal });
    }

    createFixture(fixture, signal) {
        return api.post(index.api.endpoints.fixtures, fixture, { signal });
    }

    updateFixture(id, fixture, signal) {
        return api.put(`${index.api.endpoints.fixtures}/${id}`, fixture, { signal });
    }

    deleteFixture(id, signal) {
        return api.delete(`${index.api.endpoints.fixtures}/${id}`, { signal });
    }

    addFixtureToMachine(fixtureId, machineId, signal) {
        return api.post(`${index.api.endpoints.fixtures}/${fixtureId}/machines/${machineId}`, {}, { signal });
    }

    removeFixtureFromSpecificMachine(fixtureId, machineId, signal) {
        return api.delete(`${index.api.endpoints.fixtures}/${fixtureId}/machines/${machineId}`, { signal });
    }

    createMaintenanceFixtureReport(signal, customTimeout = 65000) {
        return api.post(`${index.api.endpoints.fixtures}/maintenance`, {}, {
            signal,
            timeout: customTimeout  // Override the global timeout - 65 seconds for VPN operations
        });
    }

    createMaintenanceReportForSingleFixture(fixtureId, signal, customTimeout = 65000) {
        return api.post(`${index.api.endpoints.fixtures}/maintenance/${fixtureId}`, {}, {
            signal,
            timeout: customTimeout  // Override the global timeout - 65 seconds for VPN operations
        });
    }

    getFixtureMachineMap(id, signal) {
        return api.get(`${index.api.endpoints.fixtures}/${id}/machineMap`, { signal });
    }

    getCounterContent(signal) {
        return api.get(`${index.api.endpoints.fixtures}/counter`, { signal });
    }

    getFixturesByFilters(filters, signal) {
        // Check if all filter values are empty
        const allEmpty = Object.values(filters).every(value =>
            typeof value === 'string' ? value.trim() === '' : false
        );

        if (allEmpty) {
            return this.getAllFixtures(signal);
        }

        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if ((typeof value === 'string' && value.trim() !== '') ||
                (typeof value === 'number' && !isNaN(value))) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return api.get(`${index.api.endpoints.fixtures}/filter`, {
            params: cleanFilters,
            signal
        });
    }

    connectVnc(hostname, signal) {
        return api.post(`${index.api.endpoints.fixtures}/vnc/${hostname}`, {}, { signal });
    }

    connectToCDrive(hostname, signal) {
        return api.post(`${index.api.endpoints.fixtures}/connect-c-drive/${hostname}`, {}, { signal });
    }

    connectToDDrive(hostname, signal) {
        return api.post(`${index.api.endpoints.fixtures}/connect-d-drive/${hostname}`, {}, { signal });
    }
}

const fixtureService = new FixtureService();
export default fixtureService;