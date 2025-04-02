import api from './api.service';
import index from '../config';

class FixtureService {
    getAllFixtures() {
        return api.get(`${index.api.endpoints.fixtures}/list-all-fixtures`);
    }

    getFixtureById(id) {
        return api.get(`${index.api.endpoints.fixtures}/${id}`);
    }

    createFixture(fixture) {
        return api.post(index.api.endpoints.fixtures, fixture);
    }

    updateFixture(id, fixture) {
        return api.put(`${index.api.endpoints.fixtures}/${id}`, fixture);
    }

    deleteFixture(id) {
        return api.delete(`${index.api.endpoints.fixtures}/${id}`);
    }

    addFixtureToMachine(fixtureId, machineId) {
        return api.post(`${index.api.endpoints.fixtures}/${fixtureId}/machines/${machineId}`, {});
    }

    createMaintenanceFixtureReport() {
        return api.post(`${index.api.endpoints.fixtures}/maintenance`, {});
    }

    getMachineFixtureMap() {
        return api.get(`${index.api.endpoints.fixtures}/machineMap`);
    }

    getCounterContent() {
        return api.get(`${index.api.endpoints.fixtures}/counter`);
    }

    getFixturesByFilters(filters) {
        // Only include non-empty values in the request
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if ((typeof value === 'string' && value.trim() !== '') ||
                (typeof value === 'number' && !isNaN(value))) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return api.get(`${index.api.endpoints.fixtures}/filter`, {
            params: cleanFilters
        });
    }
}

export default new FixtureService();