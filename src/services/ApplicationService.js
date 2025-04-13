import api from './api.service';
import index from '../config';

class ApplicationService {
    shutdownApplication(signal) {
        return api.post(`${index.api.endpoints.applicationService}/shutdown`, null, { signal });
    }

    restartApplication(signal) {
        return api.post(`${index.api.endpoints.applicationService}/restart`, null, { signal });
    }

    getApplicationLogs(signal) {
        return api.get(`${index.api.endpoints.applicationService}/logs`, {
            signal,
            headers: {
                'Accept': 'text/plain'
            }
        });
    }
}

export default new ApplicationService();