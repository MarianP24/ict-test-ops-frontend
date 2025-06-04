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

    createMaintenanceFixtureReport(signal) {
        return api.post(`${index.api.endpoints.fixtures}/maintenance`, {}, { signal });
    }

    createMaintenanceReportForSingleFixture(fixtureId, signal) {
        return api.post(`${index.api.endpoints.fixtures}/maintenance/${fixtureId}`, {}, { signal });
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
}

export default new FixtureService();