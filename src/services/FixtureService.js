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
}

export default new FixtureService();